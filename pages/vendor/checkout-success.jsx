import React from "react";
import { useRouter } from "next/router";
import { Button } from "@nextui-org/react";
function Index() {
	const router = useRouter();
	const { status, type, planType } = router.query;
	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-screen py-2 bg-slate-200 ">
			{status && status === "success" && (
				<div
					id="successModal"
					className="overflow-y-auto overflow-x-hidden z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
				>
					<div className="relative p-4 w-full max-w-xl h-full md:h-auto mx-auto">
						<div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
							<div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 p-2 flex items-center justify-center mx-auto mb-3.5">
								<svg
									aria-hidden="true"
									className="w-8 h-8 text-green-500 dark:text-green-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									></path>
								</svg>
								<span className="sr-only">
									success
								</span>
							</div>
							<p className="mb-4 text-[20px] font-normal opacity-90 text-gray-900 dark:text-white">
								{planType === "Annual" ? "Thank you for subscribing. This confirms the start of your annual subscription plan. You’ll enjoy unlimited credits with FreeAdCopy.com for the next 12 months. At the end of that period, your annual plan will renew. We’ll make sure to notify you prior to your subscription renewal so you can make an informed decision at that time. You can also manage subscriptions in your settings." : "Thank you for subscribing. This confirms the start of your annual subscription plan. You’ll enjoy Creating your questions for the next month. At the end of that period, your monthly plan will renew. We’ll make sure to notify you prior to your subscription renewal so you can make an informed decision at that time. You can also manage subscriptions in your settings."}
							</p>
							<Button
								size="md"
								color="primary"
								className="global-success-btn"
								onPress={() => router.push("/vendor/document")}
							>
								Continue
							</Button>
						</div>
					</div>
				</div>
			)}
			{status && status === "cancel" && (
				<div
					id="successModal"
					className=" overflow-y-auto overflow-x-hidden   z-50 justify-center items-center w-full md:inset-0 h-modal md:h-full"
				>
					<div className="relative p-4 w-full max-w-md h-full md:h-auto mx-auto">
						<div className="relative p-4 text-center bg-white rounded-lg shadow  dark:bg-gray-800 sm:p-5">
							<div className="w-12 h-12 rounded-full bg-red-200 dark:bg-red-900 p-2 flex items-center justify-center mx-auto mb-3.5">
								<svg
									aria-hidden="true"
									className="w-8 h-8 text-red-500 dark:text-red-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									></path>
								</svg>
								<span className="sr-only">Failed</span>
							</div>
							<p className="mb-4 text-[20px] text-gray-900 dark:text-white">
								Payment process is cancelled and you can initiate the process again by clicking on Continue button
							</p>
							<Button
								size="md"
								color="primary"
								className="global-success-btn"
								onPress={() => router.push("/vendor/document")}
							>
								Continue
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Index;
