// src/components/VocabularyList.tsx
import React, { useState } from "react";
import {
  useVocabularyData,
  useTotalVocabularyCount,
} from "../hooks/useVocabularyData";
import { VocabularyItemType } from "../types";
import VocabularyItem from "./VocabularyItem";

const LoadingPlaceholder: React.FC = () => (
  <div className="vocabulary-item">
    {Array.from({ length: 9 }, (_, index) => (
      <div className="loding-height loding-width" key={index}></div>
    ))}
  </div>
);

const VocabularyList: React.FC = () => {
  const pageSize = 5; // Number of items per page
  const [understoodFilter, setUnderstoodFilter] = useState<boolean | undefined>(
    false
  );
  const [page, setPage] = useState({
    all: 1,
    understood: 1,
    ununderstood: 1,
  }); // State for current page

  const handlePageChange = (
    category: "all" | "understood" | "ununderstood",
    newPage: number,
    understood: boolean | undefined
  ) => {
    setPage((prev) => ({
      ...prev, // Spread the previous state
      [category]: newPage, // Update the specific category
    }));
    setUnderstoodFilter(understood);
  };

  const { data, isLoading, error } = useVocabularyData(
    understoodFilter,
    understoodFilter === true
      ? page.understood
      : understoodFilter === false
      ? page.ununderstood
      : page.all
  );
  const {
    data: totalCount,
    isLoading: isTotalCountLoading,
    error: totalError,
    isError,
  } = useTotalVocabularyCount();
  if (isLoading) {
    return (
      <div className="vocabulary-list">
        <div className="flex-center-jus">
          <h3>Vocabulary</h3>
          <div className="dropdown-container">
            <select
              className="dropdown-select"
              value={
                understoodFilter === true
                  ? "understood"
                  : understoodFilter === false
                  ? "ununderstood"
                  : "all"
              }
              onChange={(e) =>
                handlePageChange(
                  e.target.value as "all" | "understood" | "ununderstood",
                  page[e.target.value as "all" | "understood" | "ununderstood"],
                  e.target.value === "understood"
                    ? true
                    : e.target.value === "ununderstood"
                    ? false
                    : undefined
                )
              }
            >
              <option value="ununderstood">
                Show Not Understood - (
                {!isTotalCountLoading ? totalCount.ununderstood : 0})
              </option>
              <option value="all">
                Show All - ({!isTotalCountLoading ? totalCount.all : 0})
              </option>
              <option value="understood">
                Show Understood - (
                {!isTotalCountLoading ? totalCount.understood : 0})
              </option>
            </select>
          </div>
        </div>
        {/* Display placeholders */}
        {Array.from({ length: 5 }, (_, index) => (
          <LoadingPlaceholder key={index} />
        ))}
        <div className="pagination">
          <button disabled>Previous</button>
          <span>
            Page{" "}
            {understoodFilter === true
              ? page.understood
              : understoodFilter === false
              ? page.ununderstood
              : page.all}
          </span>
          <button disabled>Next</button>
        </div>
      </div>
    );
  }
  if (error instanceof Error || totalError instanceof Error)
    return <p>Error: {isError ? totalError?.message : error?.message}</p>;

  return (
    <div className="vocabulary-list">
      <div className="flex-center-jus">
        <h3
          style={{
            cursor: "pointer",
          }}
          onClick={() =>
            setPage((old) => ({
              ...old,
              [understoodFilter === true
                ? "understood"
                : understoodFilter === false
                ? "ununderstood"
                : "all"]:
                understoodFilter === undefined
                  ? 1
                  : understoodFilter === true
                  ? 1
                  : 1,
            }))
          }
        >
          Vocabulary
        </h3>
        <div className="dropdown-container">
          <select
            className="dropdown-select"
            onChange={(e) =>
              handlePageChange(
                e.target.value as "all" | "understood" | "ununderstood",
                page[e.target.value as "all" | "understood" | "ununderstood"],
                e.target.value === "understood"
                  ? true
                  : e.target.value === "ununderstood"
                  ? false
                  : undefined
              )
            }
          >
            {isTotalCountLoading && (
              <option className="loading-height">Loading...</option>
            )}
            <option value="ununderstood">
              Show Not Understood - (
              {!isTotalCountLoading ? totalCount.ununderstood : 0})
            </option>
            <option value="all">
              Show All - ({!isTotalCountLoading ? totalCount.all : 0})
            </option>
            <option value="understood">
              Show Understood - (
              {!isTotalCountLoading ? totalCount.understood : 0})
            </option>
            {/* Display loading indicator outside the select */}
          </select>
        </div>
      </div>
      {data && data?.length > 0 ? (
        data?.map((item: VocabularyItemType) => (
          <VocabularyItem
            {...item}
            page={
              understoodFilter === true
                ? page.understood
                : understoodFilter === false
                ? page.ununderstood
                : page.all
            }
            understoodFilter
            key={item.id}
          />
        ))
      ) : (
        <p>No data found</p>
      )}
      <div className="pagination">
        <button
          onClick={() =>
            setPage((old) => ({
              ...old,
              [understoodFilter === undefined
                ? "all"
                : understoodFilter === true
                ? "understood"
                : "ununderstood"]: Math.max(
                understoodFilter === undefined
                  ? old.all - 1
                  : understoodFilter === true
                  ? old.understood - 1
                  : old.ununderstood - 1,
                1
              ),
            }))
          }
          disabled={
            page.all === 1 && page.understood === 1 && page.ununderstood === 1
          }
        >
          Previous
        </button>
        <span>
          Page{" "}
          {understoodFilter === true
            ? page.understood
            : understoodFilter === false
            ? page.ununderstood
            : page.all}
        </span>
        <button
          onClick={() =>
            setPage((old) => ({
              ...old,
              [understoodFilter === true
                ? "understood"
                : understoodFilter === false
                ? "ununderstood"
                : "all"]:
                understoodFilter === undefined
                  ? old.all + 1
                  : understoodFilter === true
                  ? old.understood + 1
                  : old.ununderstood + 1,
            }))
          }
          disabled={data && data.length < pageSize}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default VocabularyList;
