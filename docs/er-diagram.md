erDiagram
    USER ||--o{ WORKSPACE : "owns / invited"
    WORKSPACE ||--o{ MEMBER : "includes"
    WORKSPACE ||--o{ PERIOD : "has"
    PERIOD ||--o{ MEALENTRY : "records"
    MEMBER ||--o{ MEALENTRY : "made by"
    MEMBER ||--o{ DEPOSIT : "makes"
    MEMBER ||--o{ EXPENSE : "adds"
    PERIOD ||--o{ DEPOSIT : "scoped in"
    PERIOD ||--o{ EXPENSE : "scoped in"
    WORKSPACE ||--o{ INVITATION : "issues"
    USER ||--o{ INVITATION : "recipient"
    WORKSPACE ||--o{ ADJUSTMENT : "manual correction"
    MEMBER ||--o{ ADJUSTMENT : "applies to"

    USER {
        uuid id
        string name
        string email
        string authProvider
    }

    WORKSPACE {
        uuid id
        string name
        uuid ownerId
        datetime createdAt
    }

    MEMBER {
        uuid id
        uuid workspaceId
        uuid userId
        string role
        string status
    }

    PERIOD {
        uuid id
        uuid workspaceId
        int year
        int month
        string status  // open | closed
    }

    MEALENTRY {
        uuid id
        uuid periodId
        uuid memberId
        date entryDate
        int breakfast
        int lunch
        int dinner
        int guestMeals
    }

    DEPOSIT {
        uuid id
        uuid periodId
        uuid memberId
        decimal amount
        datetime createdAt
    }

    EXPENSE {
        uuid id
        uuid periodId
        uuid memberId
        decimal amount
        string category
        string allocation  // by_meals | by_head | custom | personal
        datetime createdAt
    }

    ADJUSTMENT {
        uuid id
        uuid workspaceId
        uuid memberId
        decimal amount
        string reason
        datetime createdAt
    }

    INVITATION {
        uuid id
        uuid workspaceId
        string email
        string status   // pending | accepted | rejected
        datetime createdAt
    }
