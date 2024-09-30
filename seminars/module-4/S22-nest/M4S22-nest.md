# Seminar M4L22: Особенности Nest.js (13.08.24)

## Custom Decorators

```ts
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const Authorization = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization || null;
    return token;
  }
);
```
