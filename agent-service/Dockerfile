FROM python:3.12-slim-trixie

# Set the working directory to /app
WORKDIR /app

# Copy only the necessary files to reduce context size
COPY src/ /app/src/
COPY .env /app/.env
COPY requirements.txt /app/

# Install Python dependencies
# RUN pip install --no-cache-dir -r requirements.txt
RUN pip install -q --upgrade pip 
RUN pip install -q uv
RUN uv venv
RUN uv pip install --no-cache-dir -q -r requirements.txt

ENV VIRTUAL_ENV="/app/.venv"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV PYTHONUNBUFFERED=1

# Set the working directory for CMD to /app/src
WORKDIR /app

# Expose the application port
EXPOSE 5000

# Run the app using uvicorn from the /app/src directory
CMD ["uvicorn", "src.app:app", "--host", "0.0.0.0", "--port", "5000"]