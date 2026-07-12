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

:: Eliminar carpetas de respaldo (dentro de la carpeta destino) más viejas de 7 días
:: (se poda %~1, la carpeta raíz de respaldos, no %DESTINO% que es la recién creada)
forfiles /p "%~1" /d -7 /c "cmd /c if @isdir==TRUE rd /s /q @path" 2>nul