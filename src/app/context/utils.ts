import { useRouter } from "next/navigation";
import { useGlobalProp } from "./page";

  const ContextValidator = ()=> {
    const router = useRouter();
    const { jwt } = useGlobalProp();

    const validateTokenSession = () => {
        const token = jwt || localStorage.getItem("sessionToken");
        if (!token) {
            return false;
        } 
        return token;
    }

    const returnAuthHeaders = (document: string, token:string) => {
        return {
            "Content-Type": "application/json",
            Authorization: token,
            documentId: document,
          }
    }

    return {
        validateTokenSession,
        returnAuthHeaders,
      };
}

export default ContextValidator;