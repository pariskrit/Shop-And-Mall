import React, { useState } from "react";
import classes from "./shopform.module.css";
import { IoIosClose } from "react-icons/io";
import AllTimings from "../AllTimings/AllTimings";
import useFirestore from "../../hooks/useFirestore";

const CommonShopForm = ({
  edit,
  s,
  dispatch,
  index,
  shopImageState,
  shopImageDispatch,
  closeShopForm,
  dataShop,
  editDispatch,
  index2,
  addedShopImagesDispatch,
  addedShopImages,
  removeImage,
  register,
  errors,
  mallTime,
  mallLevels,
}) => {
  const [shopImageError, setShopImageError] = useState(null);
  const { docs } = useFirestore("Shop Categories");
  const [subCategoryLists, setSubCategoryLists] = useState([]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    edit
      ? editDispatch({
          type: "EDIT_SHOP_INFO",
          payload: { name: name, value: value, index: index2 },
        })
      : dispatch({
          type: "ADD_SHOP_INFO",
          payload: { name: name, value: value, index: index },
        });
  };

  const types = ["image/jpeg", "image/png"];
  const shopImageHandler = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      let selectedShopImages = e.target.files[i];

      if (selectedShopImages && types.includes(selectedShopImages.type)) {
        shopImageDispatch({
          type: "ADD",
          payload: { index, selectedShopImages },
        });
      } else {
        setShopImageError("Please select an image file  (jpeg or png)");
      }
    }
  };

  const onManualTimeChange = (rowId, name, value) =>
    dispatch({
      type: "ADD_SHOP_TIMINGS_MANUALLY",
      payload: { shopIndex: index, rowId, name, value },
    });

  const onDefaultTimeChange = (name, value) =>
    dispatch({
      type: "ADD_SHOP_TIMINGS",
      payload: { index, name, value },
    });

  const addMoreTimingsFields = () =>
    s.timings.length === 8
      ? alert("No More Days Left")
      : dispatch({ type: "ADD_SHOPTIMINGS_FIELDS", payload: { index } });

  const onRemoveTimingsField = (rowId) =>
    dispatch({
      type: "REMOVE_SHOPTIMINGS_FIELDS",
      payload: { shopIndex: index, rowId },
    });

  let listOfMallTimes = [mallTime[0]];
  s.timings.forEach((time, index) => {
    if (index > 0) {
      let isDayPresentInMallTime = mallTime.findIndex(
        (t) => t.label === time.label
      );
      if (isDayPresentInMallTime > 0) {
        listOfMallTimes[index] = mallTime[isDayPresentInMallTime];
      }
    }
  });
  console.log(errors);
  return (
    <div className={classes.shopContainer}>
      <div
        onClick={
          edit
            ? () => {
                closeShopForm(dataShop);
              }
            : () => closeShopForm()
        }
        className={classes.close}
      >
        <IoIosClose />
      </div>
      <div className={classes.innerDiv}>
        <div>
          <input
            type="text"
            {...register("shopName", { required: true })}
            placeholder="Name of Shop"
            name="shopName"
            value={edit ? dataShop?.shopName : s.shopName}
            onChange={onChangeHandler}
            className={classes.input}
          />
          {errors.shopName && (
            <p className={classes.error}>* Name is required</p>
          )}
        </div>
        <div>
          <input
            type="number"
            {...register("shopLevel", {
              required: true,
              validate: (value) => value < mallLevels,
            })}
            placeholder="Level"
            name="shopLevel"
            value={edit ? dataShop?.levels : s?.shopLevel}
            onChange={onChangeHandler}
            className={classes.input}
          />
          {errors.shopLevel.type === "validate" && (
            <p className={classes.error}>
              * level should be according to mall level
            </p>
          )}
          {errors.shopLevel.type === "required" && (
            <p className={classes.error}>* level is required</p>
          )}
        </div>
        <div>
          <input
            type="number"
            {...register("shopPhoneNumber", {
              required: true,
            })}
            placeholder="Phone Number"
            name="shopPhoneNumber"
            value={edit ? dataShop?.phoneNumber : s?.shopPhoneNumber}
            onChange={onChangeHandler}
            className={classes.input}
          />
          {errors.shopPhoneNumber && (
            <p className={classes.error}>* Number is required</p>
          )}
        </div>

        <textarea
          type="text"
          placeholder="Description"
          name="shopDescription"
          value={edit ? dataShop?.shopDescription : s?.shopDescription}
          onChange={onChangeHandler}
          className={classes.textarea}
        />
        <select
          name="category"
          onChange={(e) => {
            onChangeHandler(e);
            setSubCategoryLists([
              ...docs.find((category) => category.category === e.target.value)
                .rowContent.rowData,
            ]);
          }}
        >
          <option hidden>Categories</option>
          {docs.map(({ id, category }) => (
            <option key={id} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select name="subCategory" onChange={onChangeHandler}>
          <option hidden>SubCategories</option>
          {subCategoryLists.map(({ id, subCategory }) => (
            <option key={id} value={subCategory}>
              {subCategory}
            </option>
          ))}
        </select>
        <AllTimings
          state={s}
          index={index}
          onManualTimeChange={onManualTimeChange}
          onDefaultTimeChange={onDefaultTimeChange}
          addMoreTimingsFields={addMoreTimingsFields}
          onRemoveTimingsField={onRemoveTimingsField}
          isShop={true}
          mallTime={listOfMallTimes}
        />

        {shopImageError && <p>{shopImageError}</p>}
        <label className={classes.label}>
          <input multiple type="file" onChange={shopImageHandler} />
          <span>
            <div className={classes.imgButton}>Add Image</div>
          </span>
        </label>
        {!edit && (
          <p className={classes.para}>**First chosen Image will be Thumnail</p>
        )}
      </div>

      <div className={classes.selectedImages}>
        {edit
          ? dataShop.shopImages
            ? dataShop.shopImages.map((img, i) => (
                <p key={i} className={classes.image}>
                  <button
                    className={classes.button}
                    type="button"
                    onClick={() => removeImage(img, index2)}
                  >
                    <IoIosClose />
                  </button>
                  {img.ImageName}
                </p>
              ))
            : null(
                addedShopImages &&
                  addedShopImages.map(
                    (img, ind) =>
                      ind === index2 &&
                      img.images.map((img, i) => (
                        <p key={i} className={classes.image}>
                          <button
                            className={classes.button}
                            type="button"
                            onClick={() =>
                              addedShopImagesDispatch({
                                type: "REMOVE_IMAGE",
                                payload: { outerIndex: ind, name: img.name },
                              })
                            }
                          >
                            <IoIosClose />
                          </button>
                          {img.name}
                        </p>
                      ))
                  )
              )
          : shopImageState &&
            shopImageState?.map(
              (image, ind) =>
                ind === index &&
                image?.images?.map((img, i) => (
                  <p key={i} className={classes.image}>
                    <button
                      className={classes.button}
                      type="button"
                      onClick={() =>
                        shopImageDispatch({
                          type: "REMOVE_IMAGE",
                          payload: { outerIndex: ind, name: img?.name },
                        })
                      }
                    >
                      <IoIosClose />
                    </button>
                    {img?.name}
                  </p>
                ))
            )}
      </div>
    </div>
  );
};

export default CommonShopForm;
