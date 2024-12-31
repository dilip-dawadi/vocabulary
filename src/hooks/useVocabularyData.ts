import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { VocabularyItemType } from "../types";

let baseURL;

if (import.meta.env.MODE === "production") {
  baseURL = import.meta.env.VITE_BASE_URL_PROD;
} else {
  baseURL = import.meta.env.VITE_BASE_URL_DEV;
}
const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your actual base URL
});

// Function to fetch vocabulary data from the backend
const fetchVocabularyData = async (
  understoodFilter: Boolean | undefined,
  page: Number
) => {
  let url = "/vocabulary";
  if (understoodFilter === true) {
    url = "/vocabulary/understoodWords/";
  } else if (understoodFilter === false) {
    url = "/vocabulary/ununderstoodWords/";
  } else {
    url;
  }
  // Simulating a 2-second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axiosInstance.get(url, {
    params: {
      page: page,
    },
  });
  return response.data.data;
};

// Function to fetch vocabulary data from the backend /:category/totalcount
const fetchVocabularyTotalCount = async () => {
  // Simulating a 2-second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axiosInstance.get(`/vocabulary/totalcount`);
  return response.data.data;
};

// Function to update understoodVocabulary
const updateUnderstoodVocabularyItem = async (
  id: Number,
  value: Boolean
): Promise<VocabularyItemType> => {
  const response = await axiosInstance.patch(`/vocabulary/${id}/understood`, {
    data: value,
  });
  return response.data.data; // Return the vocabulary item created
};

// Function to create a new vocabulary item
const createVocabularyItem = async (data: {
  word: string;
  meaning: string;
  synonyms: string[];
  understood: boolean;
}): Promise<VocabularyItemType> => {
  const response = await axiosInstance.post("/vocabulary", data);
  return response.data; // Return the vocabulary item created
};

// Function to delete a vocabulary item
const deleteVocabularyItem = async (
  id: number
): Promise<VocabularyItemType> => {
  const response = await axiosInstance.delete(`/vocabulary/${id}`);
  return response.data; // Return the vocabulary item created
};

// Custom hook for fetching vocabulary data
export const useVocabularyData = (
  understoodFilter: boolean | undefined,
  page: Number
) => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  return useQuery({
    queryKey: [
      "vocabulary",
      understoodFilter === true
        ? "understood"
        : understoodFilter === false
        ? "ununderstood"
        : "all",
      page,
    ], // Correctly define the query key
    queryFn: () => fetchVocabularyData(understoodFilter, page), // Provide the function to fetch data
  });
};

// Custom hook for fetching total vocabulary count
export const useTotalVocabularyCount = () => {
  return useQuery({
    queryKey: ["count"], // Correctly define the query key
    queryFn: () => fetchVocabularyTotalCount(), // Provide the function to fetch data
  });
};

// custom hook to createVocabulary
export const useCreateVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VocabularyItemType, // The expected return type from the mutation
    Error, // The error type
    { word: string; meaning: string; synonyms: string[]; understood: boolean } // The input data type
  >({
    mutationFn: (item) => createVocabularyItem(item),
    onMutate: async () => {
      // Cancel current queries for the todos list
      await queryClient.cancelQueries({ queryKey: ["vocabulary"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabulary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["count"],
      });
    },
  });
};

// custom hook to deleteVocabulary
export const useDeleteVocabulary = () => {
  const queryClient = useQueryClient();
  return useMutation<
    VocabularyItemType, // The expected return type from the mutation
    Error, // The error type
    number // The input data type
  >({
    mutationFn: (item) => deleteVocabularyItem(item),
    onMutate: async () => {
      // Cancel current queries for the todos list
      await queryClient.cancelQueries({ queryKey: ["vocabulary"] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabulary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["count"],
      });
    },
  });
};

// custom hook to update understoodVacubulary
export const useUpdateUnderstoodVocabulary = () => {
  const queryClient = useQueryClient();

  return useMutation<
    VocabularyItemType, // The expected return type
    Error, // The error type
    {
      item: VocabularyItemType;
      understoodFilter: boolean | undefined;
      page: number;
    } // Input type
  >({
    mutationKey: ["vocabulary"],
    mutationFn: (item) =>
      updateUnderstoodVocabularyItem(item.item.id, item.item.understood),
    onSuccess: (data, variables) => {
      // Update the cache directly
      queryClient.setQueryData(
        [
          "vocabulary",
          variables.understoodFilter === true
            ? "understood"
            : variables.understoodFilter === false
            ? "ununderstood"
            : "all",
          variables.page,
        ],
        (oldData: VocabularyItemType[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((item) =>
            item.id === data.id
              ? { ...item, understood: data.understood }
              : item
          );
        }
      );
    },
    onError: (error) => {
      console.error("Failed to update vocabulary item:", error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["vocabulary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["count"],
      });
    },
  });
};
