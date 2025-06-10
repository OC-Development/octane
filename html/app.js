// Loading screen simulation
let loadingMessages = [
    'CONFIGURING SECURITY PARAMETERS...',
    'VALIDATING SECURITY PROTOCOLS...',
    'ESTABLISHING SECURE CONNECTION...'
];

let currentMessageIndex = 0;
let loadingProgress = 0;

function simulateLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.getElementById('loading-text');
    const progressBar = document.getElementById('loading-progress');
    
    const interval = setInterval(() => {
        loadingProgress += Math.random() * 15 + 5;
        
        if (loadingProgress >= 100) {
            loadingProgress = 100;
            progressBar.style.width = '100%';
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
            
            clearInterval(interval);
        } else {
            progressBar.style.width = loadingProgress + '%';
            
            // Change loading message
            if (loadingProgress > 33 && currentMessageIndex === 0) {
                currentMessageIndex = 1;
                loadingText.textContent = loadingMessages[1];
            } else if (loadingProgress > 66 && currentMessageIndex === 1) {
                currentMessageIndex = 2;
                loadingText.textContent = loadingMessages[2];
            }
        }
    }, 200);
}

// Start loading simulation when page loads
window.addEventListener('load', function() {
    simulateLoading();
});

window.addEventListener('message', function(event) {
    if (event.data.action === 'showLogin') {
        document.body.classList.add('visible');
        document.getElementById('login-window').style.display = 'flex';
        document.getElementById('app-window').style.display = 'none';
        document.getElementById('login-window').classList.add('fade-in');
    } else if (event.data.action === 'showApp') {
        document.getElementById('login-window').style.display = 'none';
        document.getElementById('app-window').style.display = 'flex';
        document.getElementById('app-window').classList.add('fade-in');
        showApp(event.data.isManager, event.data.isHighAuthority);
    } else if (event.data.action === 'loginFailed') {
        document.getElementById('login_error').innerText = 'ACCESS DENIED - INVALID CREDENTIALS';
    } else if (event.data.action === 'hideApp') {
        document.body.classList.remove('visible');
    }
});

function submitLogin() {
    let password = document.getElementById('login_password').value;
    fetch(`https://${GetParentResourceName()}/LoginBlackmarket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            password: password
        })
    });
}

function showApp(isManager, isHighAuthority) {
    document.body.classList.add('visible');

    let sidebarHTML = `
        <button onclick="showTab('orders')" class="slide-in">Dashboard</button>
    `;

    if (isManager) {
        sidebarHTML += `
            <button onclick="showTab('manager')" class="slide-in">Operations</button>
        `;
    }

    if (isHighAuthority) {
        sidebarHTML += `
            <button onclick="showTab('approved')" class="slide-in">Security</button>
        `;
    }

    sidebarHTML += `
        <button onclick="showTab('orders')" class="slide-in">Communications</button>
        <button onclick="showTab('orders')" class="slide-in">Archives</button>
        <button onclick="showTab('orders')" class="slide-in">Asset Orders</button>
        <button onclick="closeApp()" class="slide-in">BACK</button>
    `;

    document.querySelector('.sidebar').innerHTML = sidebarHTML;
    showTab('orders');
}

function showTab(tab) {
    const mainContent = document.getElementById('main-content');
    
    if (tab === 'orders') {
        mainContent.innerHTML = `
            <div class="fade-in">
                <h2>ASSET FORM</h2>
                <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(145deg, #1a4a1a, #0f2f0f); border: 1px solid rgba(0, 255, 0, 0.3); border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <span style="color: #00CC00; font-size: 14px;">SECURE CONNECTION | 05-23-2025 | 16:44:34</span>
                        <span style="color: #00FF00; font-size: 12px; background: rgba(0, 255, 0, 0.1); padding: 4px 8px; border-radius: 4px;">ENCRYPTED</span>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #00CC00; font-size: 14px;">Asset Name</label>
                    <input type='text' id='asset_name' placeholder='IGNITION 768'>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #00CC00; font-size: 14px;">Order Details</label>
                    <textarea id='order_details' rows='5' placeholder='YO MY DAWG , LE'></textarea>
                    <div style="text-align: right; color: rgba(0, 255, 0, 0.5); font-size: 12px; margin-top: 5px;">
                        <span id="char-count">0</span>/500 characters
                    </div>
                </div>
                
                <button onclick='submitOrder()' style="width: 100%; padding: 15px; font-size: 16px;">
                    Submit Order
                </button>
            </div>
        `;
        
        // Add character counter
        const textarea = document.getElementById('order_details');
        const charCount = document.getElementById('char-count');
        textarea.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
        
    } else if (tab === 'manager') {
        mainContent.innerHTML = `
            <div class="fade-in">
                <h2>MANAGE ORDERS</h2>
                <div style="text-align: center; padding: 40px; color: rgba(0, 255, 0, 0.6);">
                    <div style="font-size: 24px; margin-bottom: 15px;">⏳</div>
                    <p>Loading order data...</p>
                </div>
            </div>
        `;
        
        fetch(`https://${GetParentResourceName()}/RequestOrders`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: '{}'
        }).then(response => response.json()).then(orders => {
            let content = `
                <div class="fade-in">
                    <h2>MANAGE ORDERS</h2>
                    <div style="margin-bottom: 20px; color: rgba(0, 255, 0, 0.7);">
                        Total Orders: <span style="color: #00FF00; font-weight: bold;">${orders.length}</span>
                    </div>
                    <div style="overflow-x: auto;">
                        <table>
                            <tr>
                                <th>PLAYER</th>
                                <th>GANG</th>
                                <th>ASSET</th>
                                <th>DETAILS</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
            `;
            
            orders.forEach(order => {
                const statusColor = order.status === 'Pending' ? '#FFD700' : 
                                  order.status === 'Accepted' ? '#00FF00' : '#FF6B6B';
                content += `<tr>
                    <td>${order.player_name}</td>
                    <td>${order.gang_name}</td>
                    <td>${order.asset_name}</td>
                    <td>${order.order_details}</td>
                    <td><span style="color: ${statusColor}; font-weight: bold;">${order.status}</span></td>
                    <td>
                        <button onclick="updateOrder(${order.id}, 'Accepted')" style="background: linear-gradient(145deg, #1a4a1a, #0f2f0f); margin-right: 5px;">ACCEPT</button>
                        <button onclick="updateOrder(${order.id}, 'Rejected')" style="background: linear-gradient(145deg, #4a1a1a, #2f0f0f);">REJECT</button>
                    </td>
                </tr>`;
            });
            content += `
                        </table>
                    </div>
                </div>
            `;
            mainContent.innerHTML = content;
        }).catch(error => {
            mainContent.innerHTML = `
                <div class="fade-in">
                    <h2>MANAGE ORDERS</h2>
                    <div style="text-align: center; padding: 40px; color: #FF6B6B;">
                        <div style="font-size: 24px; margin-bottom: 15px;">⚠️</div>
                        <p>Failed to load orders. Please try again.</p>
                        <button onclick="showTab('manager')" style="margin-top: 20px;">Retry</button>
                    </div>
                </div>
            `;
        });
        
    } else if (tab === 'approved') {
        mainContent.innerHTML = `
            <div class="fade-in">
                <h2>APPROVED ORDERS</h2>
                <div style="text-align: center; padding: 40px; color: rgba(0, 255, 0, 0.6);">
                    <div style="font-size: 24px; margin-bottom: 15px;">⏳</div>
                    <p>Loading approved orders...</p>
                </div>
            </div>
        `;
        
        fetch(`https://${GetParentResourceName()}/GetApprovedOrders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{}'
        }).then(response => response.json()).then(orders => {
            let content = `
                <div class="fade-in">
                    <h2>APPROVED ORDERS</h2>
                    <div style="margin-bottom: 20px; color: rgba(0, 255, 0, 0.7);">
                        Approved Orders: <span style="color: #00FF00; font-weight: bold;">${orders.length}</span>
                    </div>
                    <div style="overflow-x: auto;">
                        <table>
                            <tr>
                                <th>PLAYER</th>
                                <th>GANG</th>
                                <th>ASSET</th>
                                <th>DETAILS</th>
                                <th>STATUS</th>
                            </tr>
            `;
            
            orders.forEach(order => {
                content += `<tr>
                    <td>${order.player_name}</td>
                    <td>${order.gang_name}</td>
                    <td>${order.asset_name}</td>
                    <td>${order.order_details}</td>
                    <td><span style="color: #00FF00; font-weight: bold;">${order.status}</span></td>
                </tr>`;
            });
            content += `
                        </table>
                    </div>
                </div>
            `;
            mainContent.innerHTML = content;
        }).catch(error => {
            mainContent.innerHTML = `
                <div class="fade-in">
                    <h2>APPROVED ORDERS</h2>
                    <div style="text-align: center; padding: 40px; color: #FF6B6B;">
                        <div style="font-size: 24px; margin-bottom: 15px;">⚠️</div>
                        <p>Failed to load approved orders. Please try again.</p>
                        <button onclick="showTab('approved')" style="margin-top: 20px;">Retry</button>
                    </div>
                </div>
            `;
        });
    }
}

function submitOrder() {
    let assetName = document.getElementById('asset_name').value;
    let orderDetails = document.getElementById('order_details').value;

    if (!assetName.trim() || !orderDetails.trim()) {
        alert('Please fill in all fields');
        return;
    }

    fetch(`https://${GetParentResourceName()}/SubmitOrder`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            assetName: assetName,
            orderDetails: orderDetails
        })
    }).then(res => {
        document.getElementById('main-content').innerHTML = `
            <div class="success-message fade-in">
                <div style="font-size: 48px; margin-bottom: 20px;">✅</div>
                <h2>ORDER SUBMITTED!</h2>
                <p>Your asset request has been successfully transmitted to our operations center.</p>
                <p style="color: rgba(0, 255, 0, 0.6); font-size: 14px; margin-bottom: 25px;">
                    Order ID: #${Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <p style="margin-bottom: 30px;">Please wait for approval from authorized personnel.</p>
                <button onclick="closeApp()" style="margin-right: 15px;">Close Terminal</button>
                <button onclick="showTab('orders')" style="background: linear-gradient(145deg, #1a1a4a, #0f0f2f);">New Order</button>
            </div>
        `;
    }).catch(error => {
        document.getElementById('main-content').innerHTML = `
            <div style="text-align: center; padding: 40px; color: #FF6B6B;">
                <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
                <h2>SUBMISSION FAILED</h2>
                <p>Unable to submit order. Please check your connection and try again.</p>
                <button onclick="showTab('orders')" style="margin-top: 20px;">Try Again</button>
            </div>
        `;
    });
}

function updateOrder(id, status) {
    fetch(`https://${GetParentResourceName()}/UpdateOrderStatus`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id, status: status })
    }).then(res => {
        showTab('manager');
    }).catch(error => {
        alert('Failed to update order status. Please try again.');
    });
}

function closeApp() {
    fetch(`https://${GetParentResourceName()}/closeApp`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: '{}'
    });
    document.body.classList.remove('visible');
}