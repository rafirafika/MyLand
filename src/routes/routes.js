import React from "react";
import { Redirect } from "react-router-dom";

// Layout Types
import { DefaultLayout, PlainLayout } from "src/views/containers/layouts";

// Route Views
import plantLoc from "src/views/containers/UserFarm/Location";
import harvest from "src/views/containers/UserFarm/Harvest";
import ram from "src/views/containers/UserRam/Ram";
import purchasePrice from "src/views/containers/UserRam/purchasePrice";
import news from "src/views/containers/UserRam/News";
import PurchaseTrans from "src/views/containers/UserRam/PurchaseTrans";

import BlogOverview from "src/views/containers/BlogOverview";
import UserProfileLite from "src/views/containers/UserProfileLite";
import AddNewPost from "src/views/containers/AddNewPost";
import Errors from "src/views/containers/Errors/Errors";
import ComponentsOverview from "src/views/containers/ComponentsOverview";
import Tables from "src/views/containers/Tables";
import BlogPosts from "src/views/containers/BlogPosts";
import Login from "src/views/containers/Login/login";

export default [
  {
    path: "/",
    exact: true,
    layout: DefaultLayout,
    title : 'Farm Location',
    private : true,
    component: () => <Redirect to="/user/plantation-location"/>
    
  },
  {
    path: "/user/plantation-location",
    layout: DefaultLayout,
    component: plantLoc,
    private : true,
    title : 'Farm Location',
  },
  {
    path: "/user/harvest",
    layout: DefaultLayout,
    component: harvest,
    title : 'Harvest',
    private : true,

  },
  {
    path: "/user/ram",
    layout: DefaultLayout,
    component: ram,
    title : 'RAM',
    private : true,
  },
  {
    path: "/user/ram-purchase-price",
    layout: DefaultLayout,
    component: purchasePrice,
    title : 'Purchase Price List',
    private : true,

  },
  {
    path: "/user/purchase-trans",
    layout: DefaultLayout,
    component: PurchaseTrans,
    title : 'Purchase Transactions',
    private : true,

  },
  {
    path: "/user/news",
    layout: DefaultLayout,
    component: news,
    title : 'News',
    private : true,

  },
  {
    path: "/user/blog-overview",
    layout: DefaultLayout,
    component: BlogOverview
  },
  {
    path: "/user/user-profile-lite",
    layout: DefaultLayout,
    component: UserProfileLite
  },
  {
    path: "/user/add-new-post",
    layout: DefaultLayout,
    component: AddNewPost
  },
  {
    path: "/errors",
    layout: DefaultLayout,
    component: Errors,
    title : 'Error',
  },  
  {
    path: "/user/components-overview",
    layout: DefaultLayout,
    component: ComponentsOverview
  },
  {
    path: "/user/tables",
    layout: DefaultLayout,
    component: Tables
  },
  {
    path: "/user/blog-posts",
    layout: DefaultLayout,
    component: BlogPosts
  },
  {
    path: "/Login",
    layout: PlainLayout,
    component: Login,
    private : false,
    title : 'Login',
  }
];
