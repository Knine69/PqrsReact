import { useRouter } from "next/navigation";
import { useGlobalProp } from "./page";
import forge from 'node-forge';

const public_key = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2XD4JJ+raeKiNxNyo9FR
07nCpq4yvHec32f/KP7yHDQobZu6whoqJxwIwfsFYI0fbek1QW3UUC1790+fVUPo
SnmhmOzTu7SDTZrUkLQEwRwnfqc3/pU48I0JmsBJfjvQL/VMoI0zC5DAGviB8HBW
0+iw8NqtqR0SK9qiqQrOmF/XzZsMifM3mM8pnQWFKcFvZSGiBvlU2oDnklSMgnwx
lXZT4yl2wiDlirwZIkQSzkN6fAQkrJd3EhnHUB/P41o1bzmgi/n1Kjl4Dvm7mgEB
sc5je9FqnluCJa9hSk9TTofS46zM8xRZGKLqlz4u2M+UYdfd3bKfOnITUNEJ/1zO
tQIDAQAB
-----END PUBLIC KEY-----`;

const ContextValidator = () => {
  const router = useRouter();
  const { jwt } = useGlobalProp();

  const validateTokenSession = () => {
    const token = jwt || localStorage.getItem("sessionToken");
    if (!token) {
      return false;
    }
    return token;
  };

  const returnAuthHeaders = (document: string, token: string) => {
    return {
      "Content-Type": "application/json",
      Authorization: token,
      documentId: document,
    };
  };

  const encryptData = (data: string) => {
    const publicKeyPem = forge.pki.publicKeyFromPem(public_key);
    const encrypted = publicKeyPem.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf1: {
        md: forge.md.sha256.create()
      }
    });

    let encrypt = forge.util.encode64(encrypted)
    return encrypt;
  };

  return {
    validateTokenSession,
    returnAuthHeaders,
    encryptData,
  };
};

export default ContextValidator;
