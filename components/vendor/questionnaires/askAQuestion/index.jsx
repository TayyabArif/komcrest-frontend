import React ,{useState , useEffect} from 'react'
import EnterQuestion from './EnterQuestion'
import GetAnswer from './GetAnswer'
import Reference from './Reference'
import { useCookies } from "react-cookie";
import { handleResponse } from '@/helper';
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useMyContext } from "@/context";

const AskAQuestion = () => {
  const { companyProducts } = useMyContext();
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [isLoading , setIsLoading] = useState(false)


  const [askQuestion, setAskQuestion] = useState({
    productIds: [],
    question: "",
  });
  const [answerData , setAnswerData] = useState({})




  useEffect(() => {
    setAskQuestion((prev) => ({
      ...prev,
      productIds: companyProducts && companyProducts.map((item)=> item.id)
    }));
  }, [companyProducts]);


    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
        setIsLoading(true)
        const token = cookiesData?.token;
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(askQuestion),
          redirect: "follow",
        };
  
        const response = await fetch(`${baseUrl}/generate-answer`, requestOptions);
        const data = await handleResponse(
          response,
          router,
          cookies,
          removeCookie
        );
  
        if (response.ok) {
          toast.success(data.message);
          setAnswerData(data.data)
          console.log(">>>>>>>>>>>>",data.data)
        } else {
          toast.error(data?.error);
        }
      } catch (error) {
        console.error("Error updating Resource:", error);
      } finally{
        setIsLoading(false)
      }
    };
  return (
    <div className="flex gap-5  flex-1 items-center justify-center">
    <EnterQuestion setAskQuestion={setAskQuestion} askQuestion={askQuestion} handleSubmit={handleSubmit} isLoading ={isLoading}/>
    <GetAnswer answerData={answerData}/>
    <Reference reference={answerData?.references}/>
    </div>
  )
}

export default AskAQuestion