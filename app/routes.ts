import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("logout", "routes/logout.tsx"),
  route("register", "routes/register.tsx"),
  
  // Issues routes
  route("issues", "routes/issues._index.tsx"),
  route("issues/new", "routes/issues.new.tsx"),
  route("issues/:id", "routes/issues.$id.tsx"),
  route("issues/:id/edit", "routes/issues.$id.edit.tsx"),
] satisfies RouteConfig;
