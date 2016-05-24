# Salvage

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
to the previous values in the catalog.  In the case of the example above, the value of `catalog` would
change (since the array itself is "new"), but the only element that would have a different (`!==`)
value would be the one for "Blood Rage".  All others would be `===` to their predecessor (even if
elements of the array are inserted or removed).

The API consists of just a single function, `salvage`, which is invoked as follows:

```
let newState = salvage(oldState, deserializedValue);
```

The `salvage` function will preserve as many values from within arrays and objects as possible so
as to minimize the number of new values present in the hierarchy of `newState`.

## Why?

Working with React and Angular2 UIs that depend heavily on `===` equality but, at the same time, working
with data sources that generated data from "out of memory", I wanted to be able to preserve the ability
to use `===` for efficiency.

My guess is that something like this has been done before.  However, I couldn't find such a thing.  This
is probably due to the fact that I'm not sure what Google search terms to use.  Perhaps this kind of
thing has a widely accepted name and I simply don't know what it is.  By all means, if there are libraries
out there that do this kind of thing...please let me know.

## Types

The main goal of this library is to allow in-memory values to be updated by values that originated
outside of memory.  In practice, this means values that have been reconstituted via some deserialization
process and, that, in practice means JSON.  As such, the focus here is on the JSON primitives: numbers,
strings, `null`, booleans, objects and array.  As a practical matter, I included support for both `Date`
and `function` types (even though those are outside the scope of the JSON spec).  Dates in particular could
be pretty important and could easily be transformed as part of a deserialization process.

This still leaves other types of values like `Buffer`, `Uint8Array`, *etc*. unhandled.  If `salvage` encounters
a value that it doesn't know how to handle, it will throw an exception.
