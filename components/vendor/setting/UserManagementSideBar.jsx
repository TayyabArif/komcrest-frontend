import React ,{useEffect ,useState} from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";

const UserManagementSideBar = () => {
  const router = useRouter();
  const [cookies] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const userID = cookiesData?.userId;
  const role = cookiesData?.role;
  const [selectedItem, setSelectedItem] = useState("");
  const route = router.route;



  useEffect(() => {
    const parts = route.split("/");
    const segment = parts[3];
    setSelectedItem(segment);
  }, [route]);


  return (
    <div className="bg-[#F6F7F9] w-[18%] h-full">
      <div
        className={`flex gap-1 items-center px-4 my-2 cursor-pointer ${
          selectedItem=="update-account"
            ? "bg-[#2457d7] text-white shadow-md rounded"
            : "hover:bg-gray-200 hover:shadow-md"
        }`}
        onClick={() => {
          router.push(`/vendor/setting/update-account?id=${userID}`);
        }}
      >
        <h1 className="text-[16px] 2xl:text-[20px] py-2">Account Info</h1>
      </div>

      {role == "Admin" && (
        <div
          className={`flex gap-1 items-center px-4 my-2 cursor-pointer ${
            selectedItem=="user-management"
              ? "bg-[#2457d7] text-white shadow-md rounded"
              : "hover:bg-gray-200 hover:shadow-md"
          }`}
          onClick={() => {
            router.push("/vendor/setting/user-management");
          }}
        >
          <h1 className="text-[16px] 2xl:text-[20px] py-2">User Management</h1>
        </div>
      )}
    </div>
  );
};

export default UserManagementSideBar;
