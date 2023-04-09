import React, { useState } from "react";
import { motion } from "framer-motion";

import {
  MdFastfood,
  MdCloudUpload,
  MdDelete,
  MdFoodBank,
  MdAttachMoney,
} from "react-icons/md";
import { categories } from "../utils/data";
import Loader from "./Loader";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase.config";
import { editItemData, getAllFoodItems, saveItem } from "../utils/firebaseFunctions";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { ConfirmDelete } from "./ConfirmDelete";

const Dashboard = () => {
  const initialValues={
    title:"",
    calories:"",
    price:"",
    category:null,
    imageAsset:null
  }

  //states
  const [foodData, setFoodData]=useState(initialValues)
  
  const [fields, setFields] = useState(false);
  const [alertStatus, setAlertStatus] = useState("danger");
  const [msg, setMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddItem, setIsAddItem] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [{ foodItems }, dispatch] = useStateValue();
  const [selectdItem, setSelctedItem] = useState("");
  const [isDeleteModelOpen, setIsDeleteModelOpen] = useState(false);

console.log('foodItems', foodItems)
console.log('selectdItem', selectdItem)

const handleChange=(key, data)=>{
  setFoodData({...foodData,[key]:data})
}

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log(error);
        setFields(true);
        setMsg("Error while uploading : Try AGain 🙇");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFoodData({...foodData,imageAsset:downloadURL});
          setIsLoading(false);
          setFields(true);
          setMsg("Image uploaded successfully 😊");
          setAlertStatus("success");
          setTimeout(() => {
            setFields(false);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, foodData?.imageAsset);
    deleteObject(deleteRef).then(() => {
      setFoodData({imageAsset:null});
      setIsLoading(false);
      setFields(true);
      setMsg("Image deleted successfully 😊");
      setAlertStatus("success");
      setTimeout(() => {
        setFields(false);
      }, 4000);
    });
  };

const editItem = (item) => {
  setIsAddItem(true);
  setSelctedItem(item)
  setFoodData({
    title:item?.title,
    calories:item?.calories,
    price:item?.price,
    category:item?.category,
    imageAsset:item?.imageURL
  })
  setIsEdit(true)
  // setTitle(item?.title)
  // setImageAsset(item?.imageURL)
  // setCalories(item?.calories)
  // setPrice(item?.price)
}

const handleCancel=()=>{
  setIsAddItem(false);
  setSelctedItem("")
  clearData()
  // setTitle("")
  // setImageAsset("")
  // setCalories("")
  // setPrice("")
}
console.log('foodData----', foodData)
console.log('isEdit', isEdit)
  const saveDetails = () => {
    setIsLoading(true);
    try {
      if (!foodData?.title || !foodData?.imageAsset || !foodData?.calories || !foodData?.category || !foodData?.price) {
        setFields(true);
        setMsg("Required fields can't be empty");
        setAlertStatus("danger");
        setTimeout(() => {
          setFields(false);
          setIsLoading(false);
        }, 4000);
        return
      } else {
        const data = {
          id: isEdit ? selectdItem?.id: `${Date.now()}`,
          title: foodData?.title,
          imageURL: foodData?.imageAsset,
          category: foodData?.category,
          calories: foodData?.calories,
          qty: 1,
          price: foodData?.price,
        };
        
        if(isEdit){
          editItemData(data)
        }
        else{
          saveItem(data);
        }
        setIsLoading(false);
        setFields(true);
        setMsg("Data Uploaded successfully 😊");
        setAlertStatus("success");
        setTimeout(() => {
          setFields(false);
        }, 4000);
        clearData();
      }
      setIsAddItem(false);
    } catch (error) {
      console.log(error);
      setFields(true);
      setMsg("Error while uploading : Try AGain 🙇");
      setAlertStatus("danger");
      setTimeout(() => {
        setFields(false);
        setIsLoading(false);
      }, 4000);
    }

    fetchData();
  };

  const clearData = () => {
    setFoodData(initialValues)
    // setTitle("");
    // setImageAsset(null);
    // setCalories("");
    // setPrice("");
    // setCategory("Select Category");
  };

  const fetchData = async () => {
    await getAllFoodItems().then((data) => {
      dispatch({
        type: actionType.SET_FOOD_ITEMS,
        foodItems: data,
      });
    });
  };

  return (
      <>
     
    
    {
      isAddItem ?
       <div className="w-full min-h-screen flex items-center justify-center">
        <div className="w-[90%] md:w-[50%] border border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center gap-4">
          
          
          {fields && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full p-2 rounded-lg text-center text-lg font-semibold ${
                alertStatus === "danger"
                  ? "bg-red-400 text-red-800"
                  : "bg-emerald-400 text-emerald-800"
              }`}
            >
              {msg}
            </motion.p>
          )}

          <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
            <MdFastfood className="text-xl text-gray-700" />
            <input
              type="text"
              required
              value={foodData?.title}
              onChange={({target}) => handleChange('title', target?.value)}
              placeholder="Give me a title..."
              className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
            />
          </div>

          <div className="w-full">
            <select
              onChange={({target}) => handleChange("category", target?.value)}
              className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              value={foodData?.category}
            >
              <option value="" className="bg-white">
                Select Category
              </option>
              {categories &&
                categories.map((item) => (
                  <option
                    key={item.id}
                    className="text-base border-0 outline-none capitalize bg-white text-headingColor"
                    value={item.urlParamName}
                  >
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="group flex justify-center items-center flex-col border-2 border-dotted border-gray-300 w-full h-225 md:h-340 cursor-pointer rounded-lg">
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {!foodData?.imageAsset ? (
                  <>
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <MdCloudUpload className="text-gray-500 text-3xl hover:text-gray-700" />
                        <p className="text-gray-500 hover:text-gray-700">
                          Click here to upload
                        </p>
                      </div>
                      <input
                        type="file"
                        name="uploadimage"
                        accept="image/*"
                        onChange={uploadImage}
                        className="w-0 h-0"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <div className="relative h-full">
                      <img
                        src={foodData?.imageAsset}
                        alt="uploaded image"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none hover:shadow-md  duration-500 transition-all ease-in-out"
                        onClick={deleteImage}
                      >
                        <MdDelete className="text-white" />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          <div className="w-full flex flex-col md:flex-row items-center gap-3">
            <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
              <MdFoodBank className="text-gray-700 text-2xl" />
              <input
                type="text"
                required
                value={foodData?.calories}
                onChange={({target}) => handleChange("calories",target.value)}
                placeholder="Calories"
                className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
              />
            </div>

            <div className="w-full py-2 border-b border-gray-300 flex items-center gap-2">
              <MdAttachMoney className="text-gray-700 text-2xl" />
              <input
                type="text"
                required
                value={foodData?.price}
                onChange={({target}) => handleChange("price",target.value)}
                placeholder="Price"
                className="w-full h-full text-lg bg-transparent outline-none border-none placeholder:text-gray-400 text-textColor"
              />
            </div>
          </div>

          <div className="flex items-center w-full">
          <button
              type="button"
              className="ml-0 w-full md:w-auto border-none outline-none bg-gray-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="ml-0 md:ml-auto w-full md:w-auto border-none outline-none bg-emerald-500 px-12 py-2 rounded-lg text-lg text-white font-semibold"
              onClick={saveDetails}
            >
              Save
            </button>
          </div>
        </div>
      </div> :
      <>
      <div className="flex">
      <div className="flex-initial w-full ...">
        Food Items
      </div>
      <div className="flex-initial w-32 ...">
      <button type="button" className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={()=>setIsAddItem(true)}>Add Item</button>
      </div>
    </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Item Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Image
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Category
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Calories
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Price
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody>
              {
                foodItems?.map((item)=>{
                  return <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                     {item?.title}
                  </th>
                  <td className="px-6 py-4">
                  <img src={item?.imageURL} width={70} height={70}/>
                  </td>
                  <td className="px-6 py-4">
                  {item?.category}
                  </td>
                  <td className="px-6 py-4">
                  {item?.calories}
                  </td>
                  <td className="px-6 py-4">
                  {item?.price}
                  </td>
                  <td className="px-6 py-4">
                  <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" onClick={()=>editItem(item)}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Edit
                    </span>
                  </button>
                  <button data-modal-target="popup-modal" data-modal-toggle="popup-modal" className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800" onClick={()=>{
                    setSelctedItem(item)
                    setIsDeleteModelOpen(true)}}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Delete
                    </span>
                  </button>
                  </td>
              </tr>
                })
              } 
            </tbody>
        </table>
    </div>
    </>
    }
    {isDeleteModelOpen && <ConfirmDelete setIsDeleteModelOpen = {setIsDeleteModelOpen} data={selectdItem} fetchData = {fetchData}/>}
    </>
    
  );
};

export default Dashboard;
