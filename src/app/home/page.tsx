"use client";
import { useState } from "react";
import RequestList from "./requests";
import People from "./persons";
import RequestMaker from "../request/page";
import Entity from "./entity";
export default function page() {
  const [showListRequest, setshowListRequest] = useState(false);
  const [showListPerson, setshowListPerson] = useState(false);
  const [shownEntity, setShownEntity] = useState({});

  const toggleRequestView = (item: any) => {
    setShownEntity(item[0]);
    toggleRequestListView();
  };

  const togglePersonView = (item: any) => {
    setShownEntity(item[0]);
    togglePersonListView();
  };

  const toggleRequestListView = () => {
    setshowListRequest(!showListRequest);
  };

  const togglePersonListView = () => {
    setshowListPerson(!showListPerson);
  };

  return (
    <>
      <RequestMaker />
      {showListPerson ? (
        <Entity entity={shownEntity} toggleView={togglePersonListView} isPerson={true}/>
      ) : (
        <People viewRequest={togglePersonView} />
      )}
      {showListRequest ? (
        <Entity entity={shownEntity} toggleView={toggleRequestListView} isPerson={false}/>
      ) : (
        <RequestList viewRequest={toggleRequestView} />
      )}
    </>
  );
}
