
import sak from "../../assets/profile.png";
function DeveloperCard() {
  return (
      <div className="mx-auto w-full max-w-xl place-items-center lg:col-span-5 lg:mt-3">
      
        <img src={sak.src} alt="visakphoto" className="mx-auto h-auto w-full max-w-78 rounded-xl object-cover" />

        <div className="inset-0 from-black/70 via-black/20 to-transparent" />

        <div className="bottom-0 left-0 w-full break-words p-6">
          <h3 className="text-xl items-center">Name: Vok Visak </h3>
          <h3 className="text-xl items-center">Git Hub: VISAK VOK </h3>
          
          <p className="text-lg items-center">About: He is one that was develop this website.</p>

      </div>

      

     </div>
  )
}

export default DeveloperCard
