import { Instagram, Locate, LocateIcon, Mail, MailIcon, MailX, Phone } from "lucide-react";
import { BsFacebook, BsInstagram, BsMailbox, BsThreads, BsWhatsapp } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { FaLocationPin } from "react-icons/fa6";
import { GoLocation } from "react-icons/go";
import { MdMail } from "react-icons/md";

export default function Footer() {
  const pageLinks = ["Home", "About", "Courses", "Contact"]

  return (
    <div className="bg-black text-gray-100 lg:h-72  lg:grid grid-cols-4" >

      <div className="ml-4 flex flex-col justify-center items-start" >
        <h1 className=" font-semibold text-2xl my-2 " >Learning Portal</h1>
        <p className="font-semibold" >
          Our company offer a variety of computer courses  <br />
          to provide a software knowledge   <br />
          to the future generation
        </p>
      </div>
      <div className=" flex flex-col justify-center items-start  ">
        <h1 className="text-start text-2xl font-semibold mb-2 " >Contact</h1>
        <div className="text-lg " >
          <div className="flex " >
            <MailIcon />
            <p className="text-lg ml-2 mb-2" >learningportal@gmail.com</p>
          </div>
          <div className="flex" >
            <Phone />
            <p className="text-lg ml-2 mb-2" >9876543210</p>
          </div>
          <div className="flex">
            <GoLocation className="mt-2" />
            <div  >
              <p className="text-lg ml-2 mb-2">
                Y Learning Institute   <br />
                83, Main Road, Valasaravakkam, Chennai - 600078 </p>
            </div>

          </div>

        </div>
      </div>

      <div className="flex flex-col justify-center items-center  ">

        <h1 className=" font-semibold text-2xl">Usefull Links</h1>
        <div className="" >
          {pageLinks.map((item, index) => (
            <p className=" py-2 text-lg  cursor-pointer" key={index} >{item}</p>
          ))}
        </div>
      </div>

      <div className=" flex flex-col justify-center items-center   ">

        <h1 className="  font-semibold text-2xl my-2" >Connect with us</h1>
        <div className="flex gap-4" >
          <BsThreads size={20} />
          <BsInstagram size={20} />
          <BsWhatsapp size={20} />
          <BsFacebook size={20} />

        </div>


      </div>

      <div className="col-span-12">
        <p className="  text-center text-gray-400 text-md " >@Copyright. All rights are reserved</p>
      </div>
    </div>
  )
}