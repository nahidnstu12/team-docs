# Form Handling Recipe

## Architecture Flow

```
Client → Action (Validation) → Service (Processing) → Model (Persistence) → Database
```

### in client side

we will use react `useActionState` hook. later we will develop a custom hook for this whole form management!

### in server action layer

# NEED TO INJECT SCHEMA ON SPECIFIC CONSTRUCTOR, so that validation works

in each `server action` layer class, we will provide the `schema`, `service` & `model` instance.

we will validate form input against zod schema in base server action class. if there are some errors in form validation, we early return it. otherwise, proceed to save to database.

if database need extra data modification over form input data. we will pass the data to service layer & process it & return the data from service layer.

from server action layer, we will passed down the data to specific model layer. which will communicate to database via prisma. we can return the result of operation

---

### in service layer

# NEED TO INJECT MODEL NAME ON THE SPECIFIC CONSTRUCTOR, to communicate with db

---

### in model layer

# NEED TO INJECT MODEL NAME ON THE SPECIFIC CONSTRUCTOR, to communicate with db

---

# Example Workflow

1. User submits form
2. Action layer validates input
3. Service layer processes data
4. Model layer persists to database
5. Response returned to client
6. Client updates UI based on response
