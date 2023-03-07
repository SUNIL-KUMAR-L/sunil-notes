### _There are four types of SQL joins_:

**INNER JOIN**: 
```
Returns only the rows that have matching values in both tables.
Example: Suppose we have two tables, Customers and Orders, and we want to get a list of all customers and their orders.
```

```sql
SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
INNER JOIN Orders
ON Customers.CustomerID = Orders.CustomerID;
```

**LEFT JOIN**: 

```
Returns all the rows from the left table and the matched rows from the right table. If there is no match, NULL values are returned.
Example: Suppose we have two tables, Customers and Orders, and we want to get a list of all customers and their orders, including customers who have not placed any orders.
```

```sql
SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
LEFT JOIN Orders
ON Customers.CustomerID = Orders.CustomerID;
```

**RIGHT JOIN**: 
```
Returns all the rows from the right table and the matched rows from the left table. If there is no match, NULL values are returned.
Example: Suppose we have two tables, Customers and Orders, and we want to get a list of all orders and their customers, including orders that have not been placed by any customer.
```

```sql
SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
RIGHT JOIN Orders
ON Customers.CustomerID = Orders.CustomerID;
```

**FULL OUTER JOIN**: 
```
Returns all the rows from both tables, including those that do not have a match in the other table. If there is no match, NULL values are returned.
Example: Suppose we have two tables, Customers and Orders, and we want to get a list of all customers and their orders, including customers who have not placed any orders and orders that have not been placed by any customer.
```

```sql
SELECT Customers.CustomerName, Orders.OrderID
FROM Customers
FULL OUTER JOIN Orders
ON Customers.CustomerID = Orders.CustomerID;
```
