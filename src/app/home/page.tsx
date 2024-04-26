import { useState } from "react";
import RequestList from "./requests";
import Request from "../request/page";

export default function page() {
  return (
    <>
      <Request />
      <RequestList />
    </>
  );
}
