echo ****************************************
echo *    create bnkdemo-api
echo * 
echo ****************************************
rem --output=yaml --labels=":latest"
oc delete all -l app=lab3
oc new-app https://github.com/pavlo-shcherbukha/LAB-3-StarterKit#tz_000001 --context-dir=/  --name="lab3" --env-file ./lab3.env --strategy=source --source-secret=sinc-github2 --image-stream=openshift/nodejs:12-ubi7 -l app=lab3

echo ****************************************
echo *    create bnkdemo-api Router
echo * 
echo ****************************************
oc expose svc/lab3 --hostname="app-lab3-dev.apps-crc.testing" --name="app-lab3-dev.apps-crc.testing" --port 8080 -l app=lab3
