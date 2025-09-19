import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSession } from "../../context/SessionContext";
import NavigationBar from "../../components/NavigationBar";
import Footer from "../../components/Footer";
import SideNavigation from "../../components/SideNavigation";
import CatBot from "../../components/CatBot";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

const handleGoBack = () => {
  window.history.back();
};

const AdopteeForm = () => {
  const printRef = useRef();
  const { user: loggedInUser } = useSession();
  const { catId } = useParams();
  const [cat, setCat] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState("src/assets/icons/id-card.png");

  const generateAdopteePDF = async () => {
    if (!cat || !loggedInUser) return;

    try {
      const element = printRef.current;
      if (!element) return;

      // Capture the form at a lower scale to reduce size
      const canvas = await html2canvas(element, { scale: 1, useCORS: true });
      const imgData = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG with 70% quality

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      // Calculate number of pages needed
      const pageHeightPx = pageHeight;
      const totalHeightPx = imgHeight;
      const pages = Math.ceil(totalHeightPx / pageHeightPx);

      // Add form content across multiple pages
      for (let i = 0; i < pages; i++) {
        if (i > 0) pdf.addPage();
        const offsetY = i * pageHeightPx;
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          -offsetY,
          pageWidth,
          imgHeight,
          undefined,
          "FAST"
        );
      }

      const pdfBlob = pdf.output("blob");
      console.log("PDF Size:", pdfBlob.size / 1024 / 1024, "MB");
      if (pdfBlob.size > 60 * 1024 * 1024) {
        alert(
          "PDF is too large (>60MB). Please simplify the form or contact support."
        );
        return;
      }

      const formData = new FormData();
      formData.append("certificate", pdfBlob, `${cat.name}_adoption.pdf`);
      formData.append("adoptedcat_id", cat.cat_id);

      formData.append("adopter_id", loggedInUser.user_id);
      formData.append("cat_name", cat.name);
      formData.append(
        "adopter",
        `${loggedInUser.firstname} ${loggedInUser.lastname}`
      );
      formData.append("contactnumber", loggedInUser.contactnumber);
      if (selectedImageFile) {
        formData.append("id_image", selectedImageFile, selectedImageFile.name);
      }

      const response = await axios.post(
        "http://localhost:5000/api/adoption",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        alert("✅ Adoption form submitted successfully!");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(
        "Failed to submit adoption form. Please try again or contact support."
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File size exceeds 10MB limit.");
        return;
      }
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchCatAndImages = async () => {
      try {
        const catRes = await fetch(`/api/cats/${catId}`);
        if (!catRes.ok) throw new Error("Failed to fetch cat data");
        const catData = await catRes.json();
        setCat(catData);

        const imagesRes = await fetch(`/api/cats/${catId}/images`);
        if (!imagesRes.ok) throw new Error("Failed to fetch images");
        const imagesData = await imagesRes.json();
        setImages(imagesData);

        if (imagesData.length > 0) {
          setImageSrc(imagesData[0].url);
        }
      } catch (error) {
        console.error("Error fetching cat or images:", error);
      }
    };

    fetchCatAndImages();
  }, [catId]);

  // 🔥 ADD THIS
  if (!cat) {
    return (
      <div className="flex flex-col min-h-screen pb-10">
        <CatBot />
        <NavigationBar />
        <div className="p-10">Loading cat information...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <CatBot />
      <NavigationBar />
      <div className="grid grid-cols-[80%_20%] h-full">
        <div className="flex flex-col pl-50 p-10">
          <div className="relative grid grid-cols-[30%_70%] bg-[#FFF] w-[1000px] rounded-[25px]">
            <div className="flex flex-col gap-10">
              <Link
                onClick={handleGoBack}
                className="flex flex-rows items-center gap-3 bg-[#DC8801] rounded-[15px] p-3 w-[100px] hover:bg-[#ffa71a] active:bg-[#DC8801]"
              >
                <div className="w-[25px] h-[25px]">
                  <img
                    src="\src\assets\icons\arrow.png"
                    alt=""
                    className="w-full h-auto"
                  />
                </div>
                <label className="font-bold text-[#FFF]">Back</label>
              </Link>
              <div className="flex flex-row justify-between items-center p-3 bg-[#FDF5D8] rounded-tr-[20px] rounded-br-[20px] shadow-md">
                <label className="font-bold text-[#DC8801]">Adoptee Form</label>
                <div className="flex items-center justify-center w-[30px] h-auto">
                  <img
                    src="\src\assets\icons\clipboard-white.png"
                    alt="white clipboard"
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="flex flex-row justify-between items-center p-3 bg-[#FDF5D8] rounded-tr-[20px] rounded-br-[20px] shadow-md">
                <label className="text-[#DC8801]">
                  Please answer the following questions to submit an adoption
                  request to be reviewed by our Head Volunteers!
                </label>
              </div>
            </div>
            <form
              ref={printRef}
              className="flex flex-col items-start p-10 gap-10"
              onSubmit={(e) => {
                e.preventDefault();
                generateAdopteePDF();
              }}
            >
              <div className="flex flex-row gap-2 w-full justify-between">
                <div className="flex flex-col">
                  <label htmlFor="">1. You will be adopting:</label>
                  <label className="font-bold pl-4">{cat.name}</label>
                </div>
                <div className="border-dashed border-2 border-[#B5C04A] rounded-[18px] p-2">
                  <div className="w-[250px] h-auto rounded-[15px] overflow-hidden">
                    <img
                      src={imageSrc}
                      alt={`${cat.name} photo`}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>
                  2. Please let us know how you found out about the adoption
                  opportunity:
                </label>
                <div className="grid grid-cols-2 w-full gap-2">
                  <label
                    htmlFor="radioFBPage"
                    className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input
                      type="radio"
                      id="radioFBPage"
                      name="adaptionOpportunity"
                      value="SPR Cats Facebook Page"
                    />
                    SPR Cats Facebook Page
                  </label>
                  <label
                    htmlFor="radioFBGroup"
                    className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input
                      type="radio"
                      id="radioFBGroup"
                      name="adaptionOpportunity"
                      value="Facebook Group"
                    />
                    Facebook Group
                  </label>
                  <label
                    htmlFor="radioCommunityPage"
                    className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input
                      type="radio"
                      id="radioCommunityPage"
                      name="adaptionOpportunity"
                      value="SPR Community Page"
                    />
                    SPR Community Page
                  </label>
                  <label
                    htmlFor="referral"
                    className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input
                      type="radio"
                      name="adaptionOpportunity"
                      id="referral"
                      value="Referred by a Volunteer"
                    />
                    Referred by a Volunteer
                  </label>
                  <label
                    htmlFor="other"
                    className="flex gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input
                      type="radio"
                      name="adaptionOpportunity"
                      id="other"
                      className="bg-[#e6e6e6] rounded-[5px]"
                    />
                    Others
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label>
                    3. Kindly attach an ID to verify your identity - we do our
                    best to make sure our cats are adopted by verified people.
                  </label>
                  <label className="italic text-[14px] text-[#828282]">
                    (You may opt to blur sensitive data like Social Security
                    info etc.)
                  </label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="flex items-center justify-center w-[200px] h-full border-dashed border-2 border-[#898989] p-2 object-cover rounded-[15px]">
                    <img
                      src={selectedImage || "/src/assets/icons/id-card.png"}
                      alt="id-card"
                      className="w-auto h-full"
                    />
                  </div>
                  <div className="flex flex-col w-auto">
                    <label
                      htmlFor="idUpload"
                      className="bg-[#DC8801] p-2 rounded-[10px] text-[#FFF]"
                    >
                      Attach ID Photo
                      <input
                        type="file"
                        accept="image/*"
                        id="idUpload"
                        hidden
                        onChange={handleImageChange}
                      />
                    </label>
                    <label className="italic text-[#828282] text-[14px]">
                      (Upload 1 supported file. Max. 10MB)
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>4. Have you raised a cat before?</label>
                <label
                  htmlFor="raisedYes"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="raisedCat"
                    id="raisedYes"
                    value="Yes, I know how to take care of a pet cat."
                  />
                  Yes, I know how to take care of a pet cat.
                </label>
                <label
                  htmlFor="raisedNo"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="raisedCat"
                    id="raisedNo"
                    value="No, this is my first time."
                  />
                  No, this is my first time.
                </label>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <label>
                    5. Do you have other pets right now? kindly provide
                    informatio:
                  </label>
                  <label className="italic text-[14px] text-[#7d7d7d]">
                    (Eg. "Yes, I have two dogs.")
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="Your answer here"
                  className="flex items-center p-2 border-1 border-[#252525] rounded-[8px]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>6. What is your current living situation?</label>
                <label
                  htmlFor="alone"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="currentSituation"
                    id="alone"
                    value="I live alone"
                  />
                  I live alone
                </label>
                <label
                  htmlFor="family"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="currentSituation"
                    id="family"
                    value="I live with my family (no children)."
                  />
                  I live with my family (no children).
                </label>
                <label
                  htmlFor="nochildren"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="currentSituation"
                    id="nochildren"
                    value="I live with my family (with one or more children)."
                  />
                  I live with my family (with one or more children).
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col">
                  <label htmlFor="">7. Do you have a regular income?</label>
                  <label className="italic text-[14px] leading-tight text-[#898989]">
                    (Raising indoor cats involves costs for essentials like
                    food, litter, vitamins, vaccinations, and other necessities.
                    SPR cats are trained to be indoor-only pets (owners are
                    advised to keep them indoors for safety) and are litter
                    box-trained before being made available for adoption.)
                  </label>
                </div>
                <div className="flex flex-row gap-2">
                  <label
                    htmlFor="answerYes"
                    className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input
                      type="radio"
                      name="yesNo"
                      id="answerYes"
                      value="Yes"
                    />
                    Yes
                  </label>
                  <label
                    htmlFor="answerNo"
                    className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                  >
                    <input type="radio" name="yesNo" id="answerNo" value="No" />
                    No
                  </label>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>
                  8. Are you available to pick up the cat from Siena Park
                  Residences in Bicutan, or would you prefer to meet halfway?
                </label>
                <label
                  htmlFor="yesPickUp"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="pickup"
                    id="yesPickUp"
                    value="Yes, I'm able to do a pick-up."
                  />
                  Yes, I'm able to do a pick-up.
                </label>
                <label
                  htmlFor="YesMeeting"
                  className="flex items-center gap-2 p-2 border-1 border-[#252525] rounded-[8px]"
                >
                  <input
                    type="radio"
                    name="pickup"
                    id="YesMeeting"
                    value="Yes, we can arrange a halfway meeting."
                  />
                  Yes, we can arrange a halfway meeting.
                </label>
              </div>
              <div className="flex flex-col gap-2">
                <label>
                  9. Please share any additional information in order for us to
                  know you better, we'd love to know more about you.
                </label>
                <textarea
                  name=""
                  id=""
                  rows="8"
                  placeholder="Your answer here"
                  className="p-2 border-1 border-[#252525] rounded-[8px] resize-none"
                ></textarea>
              </div>
              <button className="flex justify-center w-full text-center bg-[#B5C04A] text-[#FFF] font-bold p-2 rounded-[15px] hover:bg-[#CFDA34] active:bg-[#B5C04A]">
                Submit
              </button>
            </form>
          </div>
        </div>
        <SideNavigation />
      </div>
      <Footer />
    </div>
  );
};

export default AdopteeForm;
