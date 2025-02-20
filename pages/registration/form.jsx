import React, { useEffect, useState } from "react";
import { Euro, X } from "lucide-react";
import { Input, Button, Checkbox } from "@nextui-org/react";
import ChoosePlan from "./ChoosePlan";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Image from "next/image";
import { publicDomain } from "@/constants";
import Link from "next/link";
import PageNotFound from "@/components/pageNotFound";

const RegistrationForm = () => {
  const [cookies, setCookie, removeCookie] = useCookies(["myCookie"]);
  const cookiesData = cookies.myCookie;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState("");
  const [planId, setPlanId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [domainName, setDomainName] = useState();

  const [registerFormData, setRegisterFormData] = useState({
    name: "",
    email: "",
    subdomain: "",
    firstName: "",
    lastName: "",
    companyType: "vendor",
    termsServices: false,
    privacyPolicy: false,
    phoneNumber: "",
    createdBy: "user",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setRegisterFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    setDomainName(window.location.hostname.split(".")[0]);
  }, []);

  const handleCheckboxChange = () => {
    setRegisterFormData((prev) => ({
      ...prev,
      termsServices: !prev.termsServices,
      privacyPolicy: !prev.privacyPolicy,
    }));
  };

  const handleAddProduct = () => {
    if (product) {
      setFormErrors((prev) => ({
        ...prev,
        products: "",
      }));
      setProducts([...products, product]);
      setProduct("");
    }
  };

  const handleRemoveProduct = (index) => {
    const newProducts = products.filter((_, idx) => idx !== index);
    setProducts(newProducts);
  };

  const handleFormSubmit = () => {
    if (publicDomain.includes(registerFormData.subdomain)) {
      setFormErrors({ subdomain: "ce domain n’est pas disponible" });
      return;
    }

    if (!planId) {
      setFormErrors({ plan: "Veuillez sélectionner un plan d'abonnement" });
      return;
    }
    if (products.length == 0) {
      setFormErrors({ products: "Veuillez ajouter des produits." });
      return;
    }
    setIsLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const payLoad = JSON.stringify({
      ...registerFormData,
      products,
      planId,
    });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: payLoad,
      redirect: "follow",
    };

    fetch(`${baseUrl}/companies`, requestOptions)
      .then((response) => {
        return response.json().then((data) => ({
          status: response.status,
          ok: response.ok,
          data,
        }));
      })
      .then(({ status, ok, data }) => {
        if (ok) {
          router.push(`http://onboarding.komcrest.com/registration/thank-you`);
        } else {
          setFormErrors({
            ...formErrors,
            subdomain: data.message.subdomain,
            email: data.message.email,
          });
        }
      })
      .catch((error) => console.error("+++", error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (domainName !== "onbording") {
    return <PageNotFound />
  }

  return (
    <div className="w-[90%] lg:w-[80%] xl:w-[70%]  mx-auto my-10">
      {/* {JSON.stringify(companyPlan)} */}
      <div className="text-center lg:w-[60%] mx-auto space-y-4">
        <div className="flex justify-center">
          <Image src="/logo.png" alt="Komcrest Logo" width={230} height={230} />
        </div>
        <h1 className="md:text-[35px] text-[30px]">
          Essai gratuit{domainName}
        </h1>
        <p className="text-standard">
          Merci pour l&apos;intérêt que vous portez à notre solution de réponse
          automatisée aux questionnaires de sécurité et de conformité.
        </p>
        <p className="text-standard">
          Dans quelques instants vous allez pouvoir tester
          <span className="font-bold">
            {" "}
            gratuitement l&apos;intégralité des fonctionnalités{" "}
          </span>{" "}
          qu&apos;offre Komcrest, et ce
          <span className="font-bold"> pendant 7 jours.</span>
        </p>
      </div>
      <div className="bg-blue-600 my-10">
        <div className="w-full relative bottom-2  -ml-2 border-2 bg-white border-black text-center md:p-5 p-2  lg:px-10">
          <ChoosePlan
            setPlanId={setPlanId}
            planId={planId}
            setFormErrors={setFormErrors}
          />
          {formErrors?.plan && (
            <p className="text-[#f31260]">{formErrors?.plan}</p>
          )}
          <div className="text-left mt-10 space-y-10 ">
            <div>
              <h1 className="md:text-[30px] text-[25px] font-bold">
                Nom de votre société
              </h1>
              <p className="text-standard">
                Le nom de votre société sera utitisé pour votre domaine
                societe.komcrest.com
              </p>
              <div className="md:flex gap-10 md:w-[70%]">
                <div className="md:w-[100%]">
                  <div className="flex items-end gap-4">
                    <Input
                      label="Societe (sans accent)*                      "
                      name="subdomain"
                      value={registerFormData.subdomain}
                      onChange={handleInputChange}
                      type="text"
                      variant="underlined"
                      size="md"
                      radius="sm"
                      classNames={{
                        input: "text-standard",
                        label: "text-standard mb-1",
                      }}
                    />
                    <span className="text-standard">komcrest.com</span>
                  </div>
                  {formErrors.subdomain && (
                    <p className="text-[#f31260] text-sm">
                      {formErrors.subdomain}
                    </p>
                  )}
                </div>

                {/* <div className="flex md:w-[35%] items-end gap-4"> */}
                <Input
                  label="Nom de l'enterprise"
                  name="name"
                  value={registerFormData.name}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-standard",
                    label: "text-standard mb-1",
                  }}
                />
                {/* </div> */}
              </div>
            </div>
            <div className="text-standard">
              <h1 className="md:text-[30px] text-[25px] font-bold">
                Vos informations
              </h1>
              <p className="text-standard">
                Pour garantir une prise en compte rapide de votre demande, merci
                de renseigner votre email et votre téléphone professionnel.
              </p>
              <div className="md:flex md:w-[70%] gap-4">
                <Input
                  label="Votre prémon*"
                  name="firstName"
                  value={registerFormData.firstName}
                  onChange={handleInputChange}
                  type="text"
                  size="md"
                  classNames={{
                    input: "text-standard",
                    label: "text-standard mb-1",
                  }}
                  variant="underlined"
                />
                <Input
                  label="Votre nom*"
                  name="lastName"
                  value={registerFormData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-standard",
                    label: "text-standard mb-1",
                  }}
                />
              </div>
              <div className="md:flex md:w-[70%] gap-4">
                <div className="w-full">
                  <Input
                    label="Votre email professionnel*"
                    name="email"
                    value={registerFormData.email}
                    onChange={handleInputChange}
                    type="email"
                    variant="underlined"
                    size="md"
                    classNames={{
                      input: "text-standard w-full",
                      label: "text-standard mb-1",
                      errorMessage: "text-sm text-[#f31260]",
                    }}
                    errorMessage={`Veuillez inclure un '@' dans l'adresse e-mail. ${registerFormData.email} manque un '@'.`}
                  />
                  {formErrors.email && (
                    <p className="text-[#f31260] text-sm">{formErrors.email}</p>
                  )}
                </div>
                <Input
                  label="Votre numéro de téléphone*"
                  name="phoneNumber"
                  value={registerFormData.phoneNumber}
                  onChange={handleInputChange}
                  type="number"
                  variant="underlined"
                  size="md"
                  classNames={{
                    input: "text-standard",
                    label: "text-standard mb-1",
                  }}
                />
              </div>
            </div>

            <div>
              <h1 className="md:text-[30px] text-[25px] font-bold">
                Vos produits
              </h1>
              <p className="text-standard">
                Renseignez les différents produits qui vous vendez qui
                nécessitent de répondre à des questionnaires dédiés
              </p>
              <div className="flex items-center gap-4 mt-2 md:w-[70%]">
                <Input
                  type="text"
                  placeholder="Produit*"
                  variant="underlined"
                  value={product}
                  size="md"
                  classNames={{
                    input: "text-standard",
                    label: "text-standard mb-1",
                  }}
                  onChange={(e) => setProduct(e.target.value)}
                />
                <Button
                  className="global-success-btn px-7"
                  onPress={handleAddProduct}
                >
                  Ajouter un produit
                </Button>
              </div>
              {formErrors.products && (
                <p className="text-[#f31260] text-sm">{formErrors.products}</p>
              )}
              <div className="flex flex-col px-4 gap-2 my-4">
                {products.map((product, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <X
                      color="#e91616"
                      strokeWidth={4}
                      size={16}
                      onClick={() => handleRemoveProduct(index)}
                    />
                    <p>{product}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-1">
              <Checkbox
                isSelected={
                  registerFormData.termsServices &&
                  registerFormData.privacyPolicy
                }
                onChange={handleCheckboxChange}
                radius="none"
                size="lg"
                classNames={{
                  label: "!rounded-[3px] text-standard",
                  wrapper: "!rounded-[3px]",
                }}
              ></Checkbox>

              <span>
                J&apos;accepte les{" "}
                <a
                  href="https://komcrest.com/conditions-generales-de-vente"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-blue-600 underline">
                    Conditions générales de vente et d&apos;utilisation
                  </span>
                </a>
              </span>
            </div>

            <div className="flex justify-center">
              <Button
                isDisabled={
                  !registerFormData.email ||
                  !registerFormData.termsServices ||
                  !registerFormData.privacyPolicy ||
                  !registerFormData.subdomain
                }
                isLoading={isLoading}
                className="text-white  2xl:text-[20px] text-[16px] bg-btn-primary w-max rounded-[4px]"
                onPress={handleFormSubmit}
              >
                Confirmer l&apos;inscription
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
