export function Rsidebar() {
  return (
    <div className="p-5 bg-amber-300 rounded-s-4xl">
      <a href="" className="pr-20 text-nowrap text-lg font-semibold">
        Login or Signup
      </a>
    </div>
  );
}

import meterPhoto from "../assets/2 4.png";

export function Lsidebar() {
  return (
    <div className="">
      <nav>
        <header>
          <div>
            <span>
              <img
                src={meterPhoto}
                alt=""
                className="w-35 h-15 mt-10 bg-blue-100 rounded-r-3xl shadow-lg pl-9 pr-3 pt-1 pb-1"
              />
            </span>
          </div>
        </header>
      </nav>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-10">
      <div className="container mx-auto text-center">
        <p>&copy; 2023 Your Company Name. All rights reserved.</p>
        <p>Follow us on social media:</p>
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-white hover:text-gray-400">
            Facebook
          </a>
          <a href="#" className="text-white hover:text-gray-400">
            Twitter
          </a>
          <a href="#" className="text-white hover:text-gray-400">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

import logo from "../assets/2 2.png";

export function Header() {
  return (
    <header className="flex justify-between items-center bg-yellow-50 pl-10 pr-10 pt-0 pb-0">
      <img src={logo} alt="Logo" className="pl-10 w-70 h-35 ml-20" />
      <div className="flex justify-end pr-10">
        <ul className="flex space-x-6 text-lg">
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <img src="" alt="Notification" />
          </li>
        </ul>
      </div>
    </header>
  );
}

export function Nav() {
  return (
    <div className="flex justify-between items-center bg-yellow-600 p-4">
      <h1 className="text-white text-2xl">Home</h1>
    </div>
  );
}
