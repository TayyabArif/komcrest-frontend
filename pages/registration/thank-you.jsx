import Image from "next/image";

const ThankYou = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Komcrest Logo" width={230} height={230} />
        </div>
        <h1 className="md:text-[35px] text-[30px]">Essai gratuit</h1>
        <div className="bg-blue-600 w-[70%] mx-auto rounded">
          <p className="text-[16px] py-2 px-10 text-white">
            Génial ! Vous recevrez un email pour confirmer la création de votre
            compte et activer votre période d&apos;essaie.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
