import tcs from "../../assets/tcs.png"
import zoho from "../../assets/zoho.png"
import microsoft from "../../assets/microsoft.png"
import wipro from "../../assets/wipro.png"



export default function PlacementPartners() {
    return (
        <div className=" h-88 grid grid-rows-3 mt-4">

            <div className=" col-span-1 flex justify-center items-center" >
                <h1 className="text-2xl font-semibold italic ">Our Placement Partners</h1>
            </div>
            <div className="  row-span-2  lg:grid grid-cols-6">
                <div></div>

                <div className="flex justify-center items-center">
                    <img src={tcs} className="" />
                </div>
                <div className="flex justify-center items-start">
                    <img src={zoho} className="" />
                </div>
                <div className="flex justify-center items-start">
                    <img src={microsoft} className="w-80 " />
                </div>
                <div className="flex justify-center items-center" >
                    <img src={wipro} className="w-50 mb-8" />
                </div>

                <div></div>


            </div>

        </div>
    )
}