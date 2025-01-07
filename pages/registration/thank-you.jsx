import Image from "next/image";

const ThankYou = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center space-y-4">
      <div className="flex justify-center">
          <Image src="/logo.png" alt="Komcrest Logo" width={230} height={230} />
        </div>
        <h1 className="text-xl">Free trial</h1>
        <div className="bg-blue-600 w-[70%] mx-auto rounded">
          <p className="text-[16px] py-2 px-10 text-white">
            Awesome! You will receive an email to confirm the creation of your
            account and activate your trial period.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
