#!/bin/bash

# Agent CEO System Deployment Script
# This script helps deploy the Agent CEO system to various cloud platforms

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_tools=()
    
    if ! command_exists docker; then
        missing_tools+=("docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_tools+=("docker-compose")
    fi
    
    if ! command_exists git; then
        missing_tools+=("git")
    fi
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        print_status "Please install the missing tools and try again."
        exit 1
    fi
    
    print_success "All prerequisites are installed."
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_warning "Created .env file from .env.example. Please update the values before deploying."
            print_status "Required environment variables:"
            echo "  - OPENAI_API_KEY"
            echo "  - ANTHROPIC_API_KEY"
            echo "  - POSTGRES_PASSWORD"
            echo "  - JWT_SECRET_KEY"
            echo "  - NEXTAUTH_SECRET"
            echo ""
            read -p "Press Enter to continue after updating .env file..."
        else
            print_error ".env.example file not found. Please create .env file manually."
            exit 1
        fi
    fi
    
    # Source environment variables
    source .env
    
    # Check required variables
    local required_vars=("OPENAI_API_KEY" "ANTHROPIC_API_KEY" "POSTGRES_PASSWORD" "JWT_SECRET_KEY" "NEXTAUTH_SECRET")
    local missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -ne 0 ]; then
        print_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi
    
    print_success "Environment setup complete."
}

# Function to build Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t agent-ceo-backend ./backend/agent-ceo-api/
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t agent-ceo-frontend ./frontend/
    
    print_success "Docker images built successfully."
}

# Function to deploy locally with Docker Compose
deploy_local() {
    print_status "Deploying locally with Docker Compose..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be ready..."
    sleep 30
    
    # Check service health
    if docker-compose ps | grep -q "Up (healthy)"; then
        print_success "Local deployment successful!"
        print_status "Services are running at:"
        echo "  - Frontend: http://localhost:3000"
        echo "  - Backend API: http://localhost:5000"
        echo "  - n8n Workflows: http://localhost:5678"
        echo "  - PostgreSQL: localhost:5432"
        echo "  - Redis: localhost:6379"
    else
        print_error "Some services failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Function to deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    if ! command_exists railway; then
        print_error "Railway CLI not found. Please install it first:"
        echo "npm install -g @railway/cli"
        exit 1
    fi
    
    # Login to Railway
    railway login
    
    # Create new project or link existing
    if [ ! -f railway.json ]; then
        railway init
    fi
    
    # Deploy using railway.json configuration
    cp deploy/railway.json ./railway.json
    railway up
    
    print_success "Railway deployment initiated. Check Railway dashboard for status."
}

# Function to deploy to Render
deploy_render() {
    print_status "Deploying to Render..."
    
    if [ ! -f render.yaml ]; then
        cp deploy/render.yaml ./render.yaml
        print_status "Created render.yaml file. Please:"
        echo "1. Commit and push to your Git repository"
        echo "2. Connect your repository to Render"
        echo "3. Render will automatically deploy using render.yaml"
    else
        print_status "render.yaml already exists. Push to Git to trigger deployment."
    fi
}

# Function to deploy frontend to Vercel
deploy_vercel() {
    print_status "Deploying frontend to Vercel..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Please install it first:"
        echo "npm install -g vercel"
        exit 1
    fi
    
    # Copy Vercel configuration
    cp deploy/vercel.json ./vercel.json
    
    # Deploy to Vercel
    cd frontend
    vercel --prod
    cd ..
    
    print_success "Vercel deployment complete."
}

# Function to run health checks
health_check() {
    print_status "Running health checks..."
    
    local base_url=${1:-"http://localhost:5000"}
    
    # Check backend health
    if curl -f "$base_url/api/health" >/dev/null 2>&1; then
        print_success "Backend health check passed"
    else
        print_error "Backend health check failed"
        return 1
    fi
    
    # Check frontend health (if local)
    if [ "$base_url" = "http://localhost:5000" ]; then
        if curl -f "http://localhost:3000/api/health" >/dev/null 2>&1; then
            print_success "Frontend health check passed"
        else
            print_error "Frontend health check failed"
            return 1
        fi
    fi
    
    print_success "All health checks passed"
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    docker-compose logs -f
}

# Function to stop services
stop_services() {
    print_status "Stopping services..."
    docker-compose down
    print_success "Services stopped."
}

# Function to clean up
cleanup() {
    print_status "Cleaning up..."
    docker-compose down --volumes --remove-orphans
    docker system prune -f
    print_success "Cleanup complete."
}

# Function to backup database
backup_database() {
    print_status "Creating database backup..."
    
    local backup_file="backup_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose exec postgres pg_dump -U agent_ceo_user agent_ceo > "$backup_file"
    
    print_success "Database backup created: $backup_file"
}

# Function to restore database
restore_database() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        print_error "Please provide backup file path"
        exit 1
    fi
    
    if [ ! -f "$backup_file" ]; then
        print_error "Backup file not found: $backup_file"
        exit 1
    fi
    
    print_status "Restoring database from: $backup_file"
    
    docker-compose exec -T postgres psql -U agent_ceo_user agent_ceo < "$backup_file"
    
    print_success "Database restored successfully"
}

# Function to show usage
show_usage() {
    echo "Agent CEO System Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  local       Deploy locally with Docker Compose"
    echo "  railway     Deploy to Railway"
    echo "  render      Deploy to Render"
    echo "  vercel      Deploy frontend to Vercel"
    echo "  build       Build Docker images"
    echo "  health      Run health checks"
    echo "  logs        Show application logs"
    echo "  stop        Stop local services"
    echo "  cleanup     Clean up Docker resources"
    echo "  backup      Backup database"
    echo "  restore     Restore database from backup"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 local                    # Deploy locally"
    echo "  $0 railway                  # Deploy to Railway"
    echo "  $0 health                   # Check service health"
    echo "  $0 restore backup.sql       # Restore from backup"
}

# Main script logic
main() {
    local command=${1:-"help"}
    
    case $command in
        "local")
            check_prerequisites
            setup_environment
            build_images
            deploy_local
            health_check
            ;;
        "railway")
            check_prerequisites
            setup_environment
            deploy_railway
            ;;
        "render")
            setup_environment
            deploy_render
            ;;
        "vercel")
            setup_environment
            deploy_vercel
            ;;
        "build")
            check_prerequisites
            build_images
            ;;
        "health")
            health_check "$2"
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            stop_services
            ;;
        "cleanup")
            cleanup
            ;;
        "backup")
            backup_database
            ;;
        "restore")
            restore_database "$2"
            ;;
        "help"|*)
            show_usage
            ;;
    esac
}

# Run main function with all arguments
main "$@"

