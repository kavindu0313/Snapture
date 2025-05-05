@echo off
echo Starting PhotoShare Backend...
cd %~dp0
call mvn spring-boot:run > backend-log.txt 2>&1
