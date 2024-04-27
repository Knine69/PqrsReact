import { useState } from "react";
import RequestList from "./requests";
import Request from "../request/page";
import People from "./persons";
export default function page() {
  return (
    <>
      <Request />
      <People />
      <RequestList />
    </>
  );
}
