import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { findAuthor } from "../../Slice/authorSlice";
import { Breadcrumb } from "flowbite-react";
import "quill/dist/quill.snow.css";
import "./Author.css"; 
const Author = React.memo(() => {
  const id_author = useParams().id;
  const dispatch = useDispatch();
  const { authors, author_current } = useSelector((state) => state.author);
  console.log("author_current", author_current);

  useEffect(() => {
    if (id_author == null) return;
    dispatch(findAuthor({ id: id_author }));
  }, [id_author, authors]);
  return (
    <div className="relative">
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
                  {author_current && author_current.label}
                </div>{" "}
              </Breadcrumb.Item>
            </div>
            <div className="flex justify-center items-center text-3xl font-bold">
              {author_current && author_current.label}
            </div>
          </div>
        </Breadcrumb>
        <div className="desc w-[1170px] m-auto py-8 px-10 text-left">
          <div className="ql-editor">
            {author_current && (
              <div
                dangerouslySetInnerHTML={{ __html: author_current.information }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
export default Author;
