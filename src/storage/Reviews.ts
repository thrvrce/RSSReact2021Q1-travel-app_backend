import { ObjectId } from "bson";
import { reviewsCollection } from "./Collections";
import {
  Review,
  updateReview,
  documentUpdateResult,
  reviewInsDelResult,
} from "../Types";
import { updateOneAnyDocument } from "./commonFunctions";
import { checkSession } from "./Users";

async function insertReview(newReview: Review, token: string) {
  const result: reviewInsDelResult = {
    authorizationStatus: false,
    operationResult: false,
  };
  const { authorizationStatus } = await checkSession(token);

  if (authorizationStatus) {
    result.authorizationStatus = authorizationStatus;
    const reviews = await reviewsCollection;
    const { insertedCount } = await reviews.insertOne(newReview);
    result.operationResult = Boolean(insertedCount);
  }
  return result;
}

async function getAllReviews(): Promise<Review[]> {
  const reviews = await reviewsCollection;
  const arrOfReviews = await reviews
    .find()
    .map((review) => review)
    .toArray();
  return arrOfReviews;
}

async function getReviewById(id: string): Promise<Review> {
  const reviews = await reviewsCollection;
  const review = await reviews.findOne({ _id: new ObjectId(id) });
  return review;
}

async function updateReviewById({
  filter,
  updateFields,
  token,
}: updateReview): Promise<
  documentUpdateResult & { updatedReview: Review | null }
> {
  let updatedReview: Review | null = null;
  const docUpdResult: documentUpdateResult = await updateOneAnyDocument(
    reviewsCollection,
    filter,
    updateFields,
    token
  );
  if (docUpdResult.updateStatus) {
    updatedReview = await (await reviewsCollection).findOne(filter);
  }
  return { ...docUpdResult, updatedReview };
}

async function deleteReviewById(id: string, token: string) {
  const result: reviewInsDelResult = {
    authorizationStatus: false,
    operationResult: false,
  };
  const { authorizationStatus } = await checkSession(token);

  if (authorizationStatus) {
    result.authorizationStatus = authorizationStatus;
    const reviews = await reviewsCollection;
    const { deletedCount } = await reviews.deleteOne({ _id: new ObjectId(id) });
    result.operationResult = Boolean(deletedCount);
  }
  return result;
}
export {
  insertReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
