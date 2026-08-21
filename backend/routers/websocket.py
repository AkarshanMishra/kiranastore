from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, List
import json

router = APIRouter(tags=["websocket"])

class ConnectionManager:
    def __init__(self):
        # Map order_number -> list of WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, order_number: str, websocket: WebSocket):
        await websocket.accept()
        if order_number not in self.active_connections:
            self.active_connections[order_number] = []
        self.active_connections[order_number].append(websocket)

    def disconnect(self, order_number: str, websocket: WebSocket):
        if order_number in self.active_connections:
            if websocket in self.active_connections[order_number]:
                self.active_connections[order_number].remove(websocket)
            if not self.active_connections[order_number]:
                del self.active_connections[order_number]

    async def broadcast_order_update(self, order_number: str, data: dict):
        if order_number in self.active_connections:
            for connection in self.active_connections[order_number]:
                try:
                    await connection.send_json(data)
                except Exception:
                    pass

manager = ConnectionManager()

@router.websocket("/ws/orders/{order_number}")
async def order_websocket_endpoint(websocket: WebSocket, order_number: str):
    await manager.connect(order_number, websocket)
    try:
        while True:
            # Keep connection open and receive optional ping messages
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        manager.disconnect(order_number, websocket)
