# PHP DB Config File

```php
<?php

class Database
{
    private $host = "sql.njit.edu";
    private $db_name = "db_name";
    private $username = "ucid";
    private $password = "pass";
    private $conn;

    public function connect(): PDO
    {
        $this->conn = null;

        try {
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];

            $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->db_name;

            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            header('HTTP/1.0 403 Forbidden', true, 403);
            echo 'Connection Error: ' . $e->getMessage();
        }

        return $this->conn;
    }
}
```
