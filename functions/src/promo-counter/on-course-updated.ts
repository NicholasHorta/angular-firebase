import * as functions from "firebase-functions";
import { db } from "../init";
import { FieldValue } from "@google-cloud/firestore";

export default async(change, context) => {
    if(context.params.courseId === 'stats'){
        return;
    }

    functions.logger.debug(
        `Running update course trigger for courseId ${context.params.courseId}`
    )

    //| Provides a snapshot of the data after the change - So we get the NEW data
    const newData = change.after.data();
    //| Provides a snapshot of the data before the change - OLD data
    const oldData = change.before.data();

    let increment = 0;

    if(!oldData.promo && newData.promo){
        increment = 1;
    } else if (oldData.promo && !newData.promo){
        increment = -1;
    }

    if(increment === 0){
        return;
    }

    return db.doc('courses/stats').update({
        totalPromo: FieldValue.increment(increment)
    })

}