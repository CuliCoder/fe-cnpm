import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { findAuthor } from "../../Slice/authorSlice";
import { Breadcrumb } from "flowbite-react";

const Author = React.memo(() => {
  const id_author = useParams().id;
  const dispatch = useDispatch();
  const { authors, author_current } = useSelector((state) => state.author);

  useEffect(() => {
    if (id_author == null) return;
    dispatch(findAuthor({ id: id_author }));
  }, [id_author, authors]);
  return (
    <div>
      <div className="author pb-[120px]">
        <Breadcrumb
          aria-label="Solid background breadcrumb example"
          className="bg-[#f4f9fc] h-[80px] items-centerpx-5 py-3 dark:bg-gray-800"
        >
          <div className="w-[1170px] m-auto">
            <div className="flex justify-center items-center">
              <Breadcrumb.Item>
                <Link to="/">Trang Chủ</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <div className="text-gray-800">
                  {author_current && author_current.name}
                </div>{" "}
              </Breadcrumb.Item>
            </div>
            <div className="flex justify-center items-center text-3xl font-bold">
              {author_current && author_current.name}
            </div>
          </div>
        </Breadcrumb>
      </div>
    </div>
  );
});
export default Author;
