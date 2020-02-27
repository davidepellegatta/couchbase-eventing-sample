
/**
 * Couchbase OnUpdate function
 * 
 * @param {*} doc 
 * @param {*} meta 
 */
function OnUpdate(doc, meta) {
    //let's observe only the mutations for dealsDetails
    if(meta.id.startsWith('dealsDetails::') != true) {
        return;
    }

    var dealsDocumentId = 'deals::' + doc.ndg;
    var dealsDocument = retrieveDealsDocument(dealsDocumentId);
    
    //If the document doesn't exist it is time to create a new one.
    if(dealsDocument == undefined || dealsDocument == null) {
        dealsDocument = createDealsDocument(dealsDocumentId, doc.ndg);
    }

    var stagedDeals = [];
    var dealFound = false;
    
    //Updates existing deals
    var updateResult = updateExistingDeals(dealsDocument, doc);
    
    for(const oldDeal of updateResult.stagedDeals) {
        stagedDeals.push(oldDeal);
    }
    
    //If the current document contains a new deal it adds it
    if (updateResult.dealFound == false) {
        
        log('is a new deal: ' + doc.dealId);
        
        var newDeal = {};
        newDeal.dealId = doc.dealId;
        newDeal.name = doc.name;
        
        stagedDeals.push(newDeal);
    }
    
    //update deals with the new mutations
    dealsDocument.deals = stagedDeals;
    
    //persist the mutations
    try {
        customerBucket[dealsDocumentId] = dealsDocument;
    } catch (e) {
        log(e);
    }
    
}

/**
 * Couchbase OnDelete function
 * @param {*} meta 
 */
function OnDelete(meta) {
    
    //check that there is a deals document
    if(meta.id.startsWith('dealsDetails::') != true) {
        return;
    }
    
    var dealsDocumentId = 'deals::' + doc.ndg;
    var dealsDocument = retrieveDealsDocument(dealsDocumentId);
    
    if(dealsDocument == undefined || dealsDocument == null) {
        log('deals document ' + dealsDocumentId + ' not found');
        return;
    }
    
    //remove the relevant entry
    //dealsDocument.
}

/**
 * Looks on Couchbase for an existing document give its id.
 * 
 * @param {*} dealsDocumentId 
 */
function retrieveDealsDocument(dealsDocumentId) {
    var dealsDocument = null;
    
    try {
        dealsDocument = customerBucket[dealsDocumentId];
         
    } catch (e) {
        log('Error while retrieving docId', e)
    }
    
    return dealsDocument;
}

/**
 * Goes through the existing deals and add/updates them.
 * 
 * @param {*} dealsDocument 
 * @param {*} doc 
 */
function updateExistingDeals(dealsDocument, doc) {
    var stagedDeals = [];
    var dealFound = false;
    
    if(dealsDocument.deals !== undefined) {
        
        var dbDeals = dealsDocument.deals;
        
        for (const oldDeal of dbDeals) {
        
            log('old deal: ' + doc.dealId);
            
            if(oldDeal.dealId !== undefined) {
                if(oldDeal.dealId == doc.dealId) {
                
                    log('updating old deal: ' + doc.dealId);
                    
                    //update with the new content
                    oldDeal.name = doc.name;
                    
                    dealFound = true;
                }
            }
            
            stagedDeals.push(oldDeal);
        }
    }
    
    return {stagedDeals, dealFound};
}

/**
 * Creates a deals summary document.
 * 
 * @param {*} dealsDocumentId 
 * @param {*} ndg 
 */
function createDealsDocument(dealsDocumentId, ndg) {
    
    var dealsDocument = {};
    
    dealsDocument['ndg'] = ndg;
    dealsDocument['type'] = 'deals';
    dealsDocument['deals'] = []; 
    
    return dealsDocument;
}
