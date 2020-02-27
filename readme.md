# Couchbase Eventing Sample

Couchbase eventing functions can be used for multiple use cases. On this repo it is shown how an eventing function can create summary documents useful for a direct Key-Value access.

It is also shown how to run unit tests on your function before you deploy it!

## DataModel

### Deals Details Object
This object is provided by an external source and we would like to have a catalog of deals that a user can access by K/V
```
KEY: dealsDetails::<identifier of the user>::<identifier of the deal>
(e.g. `dealsDetails::123::one` )
```

```javascript
{
  "ndg": "456",                         //Identifier of the user
  "dealId": "one",                      //Identifier of the deal
  "name": "house for a long long time"  //Description of the deal
}
```

### Deals Object
This object is created and maintained by the eventing function. Every time a new Deals Details is either updated or deleted, the eventing function tracks the mutation here 
```
KEY: deals::<identifier of the user>
(e.g. `deals::123` )
```

```javascript
{
  "ndg": "123",
  "type": "deals",
  "deals": [
    {
      "dealId": "one",
      "name": "house for a long long time"
    }
  ]
}
```