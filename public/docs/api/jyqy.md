# API 使用示例

## 请求示例

### 获取数据列表

```javascript
const response = await fetch('/api/data/list', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer your_token',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
```

### 提交数据

```javascript
const response = await fetch('/api/data/submit', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'example',
    value: 123
  })
});
```

## 响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```
