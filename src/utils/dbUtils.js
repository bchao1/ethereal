export const cleanUp = result => {
    delete result["__v"];
    delete result["_id"];
    return result;
}
