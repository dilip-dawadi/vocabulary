import express, { Request, Response, Router } from "express";
import { createWord } from "../queries/insert.js";
import {
  getAllWords,
  getUnunderstoodWords,
  getUnderstoodWords,
  getTotalCount,
} from "../queries/select.js";
import { updateWordQuery } from "../queries/update.js";
import { deleteWord } from "../queries/delete.js";

const router: Router = express.Router();

// Route to fetch vocabulary, filtering based on "understood" status
// get req /vocabulary
router.get("/", async (req, res) => {
  const { page } = req.query;
  const numberPage = Number(page);
  try {
    const vocabularyItems = await getAllWords(numberPage);

    res.json({
      data: vocabularyItems,
      message: "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching vocabulary");
  }
});

// get req /vocabulary with only not understood
router.get("/ununderstoodWords", async (req, res) => {
  const { page } = req.query;
  const numberPage = Number(page);
  try {
    const vocabularyItems = await getUnunderstoodWords(numberPage);

    res.json({
      data: vocabularyItems,
      message: "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching vocabulary");
  }
});

// get req /vocabulary with only understood
router.get("/understoodWords", async (req, res) => {
  const { page } = req.query;
  const numberPage = Number(page);
  try {
    const vocabularyItems = await getUnderstoodWords(numberPage);

    res.json({
      data: vocabularyItems,
      message: "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching vocabulary");
  }
});

// get req /totalcount
router.get("/totalcount", async (req, res) => {
  try {
    const totalCount = await getTotalCount();
    res.status(200).json({ data: totalCount, message: "" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

// post req /vocabulary
router.post("/", async (req, res) => {
  const data = req.body;
  delete data.id;
  try {
    const vocabularyItems = await createWord(data);

    res.json({ data: vocabularyItems, message: "" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching vocabulary");
  }
});

router.patch("/:id/understood", async (req, res) => {
  const id = req.params.id;
  const data = req.body.data;
  // Validate ID
  const numericId = Number(id);
  const bolData = Boolean(data);
  try {
    if (!Number.isInteger(numericId) || numericId <= 0) {
      res
        .status(400)
        .json({ message: "Invalid request: ID must be a positive number" });
      return;
    }
    const data = await updateWordQuery(numericId, bolData);
    // Respond with the updated word
    res.json({
      data: data,
      message: "Word status updated successfully",
    });
  } catch (error) {
    console.error("Error updating word:", error);
    res
      .status(500)
      .json({ message: "An internal error occurred", error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const numbericID = Number(id);
  try {
    await deleteWord(numbericID);
    res.json({ data: [], message: "" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching vocabulary");
  }
});

export default router;
