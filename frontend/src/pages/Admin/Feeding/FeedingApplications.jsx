import React from 'react'
import AdminSideBar from '../../../components/AdminSideBar'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'

const FeedingApplications = () => {
  const [applicant, setApplicant] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/feeders/application`);
        console.log(response.data)
        setApplicant(response.data)
      } catch(err) {
          console.error('Error retrieving application data: ', err)
      }
    }

    fetchApplications()
  }, []);


  return (
    <div className='relative flex flex-col h-screen overflow-hidden'>
        <div className='grid grid-cols-[20%_80%]'> 
            <AdminSideBar />
            <div className='flex flex-col items-center p-10 min-h-screen gap-5 mx-auto'>
              <div className='flex flex-row justify-start w-full border-b-2 border-b-[#525252]'>
                <label className='font-bold text-[24px]'>Feeding Application</label>
              </div>


              {/* FILTERS */}
              <div className='flex flex-row justify-between w-full'>
                <form className='flex gap-2'>
                  <input type="search" placeholder='Search' className='bg-[#FFF] p-2 min-w-[400px] border-1 border-[#595959] rounded-[15px]'/>
                  <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
                </form>


                <form className='flex flex-row items-center gap-2'>
                  <div className='flex items-center gap-1'>
                    <label className='leading-tight'>Date</label>
                    <input type="date" name="" id="" className='bg-[#FFF] p-2 min-w-[250px] rounded-[15px] border-1 border-[#595959]'/>
                  </div>
                  <button className='bg-[#CFCFCF] p-2 pl-4 pr-4 rounded-[15px] cursor-pointer hover:bg-[#a3a3a3] active:bg-[#CFCFCF]'>Search</button>
                </form>
              </div>


              {/* Application ID/Application Name/ Date Applied */}
              <table className='flex flex-col w-full gap-2'>
                <thead className='flex w-full'>
                  <tr className='grid grid-cols-5 justify-items-start place-items-start w-full bg-[#DC8801] p-3 rounded-[15px] text-[#FFF]'>
                    <th>Application No.</th>
                    <th>Applicant Name</th>
                    <th>Date Applied</th>
                    <th>Application Form</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className='flex flex-col w-full overflow-y-scroll min-h-[600px]'>
                  {applicant.map((application) => (
                    <tr key={application.application_number} className='grid grid-cols-5 justify-items-start place-items-center w-full bg-[#FFF] p-3 rounded-[15px] text-[#2F2F2F] border-b-1 border-b-[#595959]'>
                      <td>{application.application_number}</td>
                      <td>{`${application.firstname} ${application.lastname}`}</td>
                      <td>{application.date_applied}</td>
                      <td>
                        <Link to={`/feedingapplications/feedingapplicationview/${application.application_number}`} className='flex items-center gap-4 text-[#DC8801] underline font-bold hover:text-[#977655] active:text-[#DC8801]'>
                          {application.application_form}
                        </Link>
                      </td>
                      <td className={application.status == 'Accepted' 
                        ? 'bg-[#B5C04A] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[10px]' 
                        : application.status == 'Rejected'
                          ? 'bg-[#977655] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[10px]'
                          : 'bg-[#595959] text-[#FFF] font-bold p-2 pl-4 pr-4 rounded-[10px]'
                          }>{application.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </div>
        </div>
    </div>
  )
}

export default FeedingApplications