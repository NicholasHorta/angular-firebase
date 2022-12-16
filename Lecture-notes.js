//!! Documents & Collections 

//| In order to access a single document, this will supply us with options of how to retrieve
/// this.db
/// this.db.doc(<collection/docId>)
/// .get()
/// .subscribe((doc) => {
///   console.log(doc.exists);
///   console.log(doc.id);
///   console.log(doc.data());
/// });
//| We can the access additional collections within the document too
/// this.db
/// this.db.doc(<collection/docId/collection/docId>)
/// .get()
/// .subscribe((doc) => {
///   console.log(doc.exists);
///   console.log(doc.id);
///   console.log(doc.data());
/// });

//| Unique ID's are not generated on the server side, they are generated on the client side, 
//| so they can be generated offline without the worry of overwriting an existing ID.
/// 7QKOZ3JHLH40hhT2zR1b

