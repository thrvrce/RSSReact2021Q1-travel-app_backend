import { Collection } from "mongodb";
import { checkSession } from "./Users";
import { documentUpdateResult, reviewInsDelResult } from "../Types";

async function updateOneAnyDocument(
  anyCollection: Promise<Collection<any>>,
  filterObj: object,
  updateObj: object,
  token: string
): Promise<documentUpdateResult> {
  const docUpdResult: documentUpdateResult = {
    authorizationStatus: false,
    updateStatus: false,
    message: "Update failed.",
  };
  const { authorizationStatus } = await checkSession(token);
  if (authorizationStatus) {
    docUpdResult.authorizationStatus = true;
    const connectedAnyCollection = await anyCollection;
    const {
      matchedCount,
      modifiedCount,
    } = await connectedAnyCollection.updateOne(filterObj, {
      $set: updateObj,
    });

    if (matchedCount && modifiedCount) {
      docUpdResult.message = "Update successful.";
      docUpdResult.updateStatus = true;
    }
    if (!matchedCount) {
      docUpdResult.message += " Document did not found.";
    } else if (!modifiedCount) {
      docUpdResult.message +=
        " Document did not update. Check new data (exist data do not update)";
    }
  } else {
    docUpdResult.message += " User unauthorized, session expired.";
  }
  return docUpdResult;
}

function setResStatus({
  operationResult,
  authorizationStatus,
}: reviewInsDelResult) {
  if (!operationResult) {
    return 500;
  }
  if (!authorizationStatus) {
    return 401;
  }
  return 200;
}

export { updateOneAnyDocument, setResStatus };
