@echo off

:: Verificar que se pasó el argumento
if "%~1"=="" (
    echo ERROR: Debes proporcionar la ruta de destino.
    echo Uso: mongo_backup.bat "C:\ruta\destino"
    exit /b 1
)

:: Formato de fecha y hora para el nombre de la carpeta
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set FECHA=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

:: Ruta destino desde el argumento
set DESTINO=%~1\%FECHA%

:: Ejecutar mongodump
mongodump --out "%DESTINO%"

:: Eliminar respaldos más viejos de 7 días
forfiles /p %DESTINO% /d -7 /c "cmd /c rd /s /q @path" 2>nul