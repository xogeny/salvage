# Recreate

This library to handle the use case where you have React components (or any system where you want to use
the `===` operator to determine equality) but your data is coming from non-in-memory source.  The use case
I'm most concerned with is when data is being deserialized from a web sockets of HTTP responses.  Such data
comes into the Javascript environment as a completely new JSON instance.  But in some cases, it may be
the case that only a fraction of that data is actually new (as compared to some previously deseralized
value).

This library attempts to efficiently salvage as much as possible of the "current" value in memory rather
than completely replacing it with a newly known value.  I could imagine this library could also be useful
as an operator for an `Observable` in order to salvage parts of previously reported values.

## Examples

Consider that your current application state is represented by something like this:

```
{
    catalog: [{
        product: "Settlers of Catan",
        price: "$35.27",
    }, {
        product: "Blood Rage",
        price: "$50.60",
    }, ..., {
        product: "Star Wars: Rebellion",
        price: "$76.44",
    }]
}
```

Then imagine that you query your server after a price drop for one item and get back this response:

```
{
    catalog: [{
        product: "Settlers of Catan",
        price: "$35.27",
    }, {
        product: "Blood Rage",
        price: "$38.78",  // <-- Only change
    }, ..., {
        product: "Star Wars: Rebellion",
        price: "$76.44",
    }]
}
```
You wouldn't want to trigger unnecessary redraws.  So, an ideal situation would be to preserve the
items in the `catalog` that didn't change.  By preserve, I mean that they are equal (as in `===`)
to the previous values in the catalog.

We can `salvage` the values as follows:

```
let newState = salvage(oldState, deserializedValue);
```

The `salvage` function will preserve as many values from within arrays and objects as possible so
as to minimize the number of new values present in the hierarchy of `newState`.

## Types

Currently, the library supports `number`, `string`, `null`, objects and arrays.  I need to add some test
cases for `Date` to make sure that is handled correctly.  If it encounters a value that it doesn't know
how to salvage, it will throw an exception.
