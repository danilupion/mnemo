## Cloud

### Docker

#### Images creation

```bash
docker build -t mnemo/base -f Dockerfile  .
docker build -t mnemo/server -f packages/server/Dockerfile  .
docker build -t mnemo/web -f packages/client/Dockerfile  .
```

#### Debugging the images

##### Base

```bash
docker container run -it --rm mnemo/base /bin/sh
```

##### Server

```bash
docker container run -it --rm mnemo/server /bin/sh
```

##### Web

```bash
docker container run -it --rm mnemo/web /bin/sh
```

### Helm

#### Installing

##### Server

```bash
helm install -n mnemo --create-namespace mnemo-server ./apps/server/helm-chart
```

##### Web

```bash
helm install -n mnemo --create-namespace mnemo-web ./apps/web/helm-chart
```

#### Uninstalling

##### Server

```bash
helm uninstall -n mnemo --create-namespace mnemo-server
```

##### Web

```bash
helm uninstall -n mnemo --create-namespace mnemo-web ./apps/web/helm-chart
```

### Helmfile

Our setup works with environments, so assuming you created a values.yaml in the following path:

```
environments
  local
    values.yaml
```

#### Installation

```bash
helmfile apply -e local
```

#### Uninstalling

```bash
helmfile destroy -e local
```