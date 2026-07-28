import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import db
from routes import api
from seed import seed_database

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes (frontend communication)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Explicit CORS header fallback for preflight OPTIONS & error handling
    @app.after_request
    def apply_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    db.init_app(app)

    # Register API blueprint
    app.register_blueprint(api, url_prefix='/api')

    @app.route('/', methods=['GET'])
    def root_index():
        return jsonify({
            'name': 'Network Device Inventory Manager API Server',
            'status': 'Online',
            'api_base': '/api',
            'documentation': 'Access /api to view full endpoint catalog'
        }), 200

    # Global error handlers for JSON responses
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({'error': 'Endpoint not found'}), 404

    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500

    with app.app_context():
        db.create_all()
        seed_database()

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
