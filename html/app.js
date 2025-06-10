window.addEventListener('message', function(event) {
    if (event.data.action === 'showLogin') {
        document.body.classList.add('visible');
        document.getElementById('login-window').style.display = 'flex';
        document.getElementById('app-window').style.display = 'none';
    } else if (event.data.action === 'showApp') {
    document.getElementById('login-window').style.display = 'none';
    document.getElementById('app-window').style.display = 'flex';
    showApp(event.data.isManager, event.data.isHighAuthority);
    } else if (event.data.action === 'loginFailed') {
        document.getElementById('login_error').innerText = 'Wrong password!';
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
        <button onclick="showTab('orders')">Asset Orders</button>
    `;

    if (isManager) {
        sidebarHTML += `
            <button onclick="showTab('manager')">Manage Orders</button>
        `;
    }

    if (isHighAuthority) {
        sidebarHTML += `
            <button onclick="showTab('approved')">Approved Orders</button>
        `;
    }

    sidebarHTML += `
        <button onclick="closeApp()">Close</button>
    `;

    document.querySelector('.sidebar').innerHTML = sidebarHTML;

    showTab('orders');
}


function showTab(tab) {
    if (tab === 'orders') {
        document.getElementById('main-content').innerHTML = `
            <h2>Asset Orders</h2>
            <input type='text' id='asset_name' placeholder='Asset Name'>
            <textarea id='order_details' rows='5' placeholder='Order Details'></textarea>
            <button onclick='submitOrder()'>Submit Order</button>
        `;
    } else if (tab === 'manager') {
        fetch(`https://${GetParentResourceName()}/RequestOrders`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: '{}'
        }).then(response => response.json()).then(orders => {
            let content = '<h2>Manage Orders</h2><table border="1"><tr><th>Player</th><th>Gang</th><th>Asset</th><th>Details</th><th>Status</th><th>Actions</th></tr>';
            orders.forEach(order => {
                content += `<tr>
                    <td>${order.player_name}</td>
                    <td>${order.gang_name}</td>
                    <td>${order.asset_name}</td>
                    <td>${order.order_details}</td>
                    <td>${order.status}</td>
                    <td>
                        <button onclick="updateOrder(${order.id}, 'Accepted')">Accept</button>
                        <button onclick="updateOrder(${order.id}, 'Rejected')">Reject</button>
                    </td>
                </tr>`;
            });
            content += '</table>';
            document.getElementById('main-content').innerHTML = content;
        });
    } else if (tab === 'approved') {
    // Trigger callback to server
    fetch(`https://${GetParentResourceName()}/GetApprovedOrders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    }).then(response => response.json()).then(orders => {
        let content = '<h2>Approved Orders</h2><table border="1"><tr><th>Player</th><th>Gang</th><th>Asset</th><th>Details</th><th>Status</th></tr>';
        orders.forEach(order => {
            content += `<tr>
                <td>${order.player_name}</td>
                <td>${order.gang_name}</td>
                <td>${order.asset_name}</td>
                <td>${order.order_details}</td>
                <td>${order.status}</td>
            </tr>`;
        });
        content += '</table>';
        document.getElementById('main-content').innerHTML = content;
    });
}

}

function submitOrder() {
    let assetName = document.getElementById('asset_name').value;
    let orderDetails = document.getElementById('order_details').value;

    fetch(`https://${GetParentResourceName()}/SubmitOrder`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            assetName: assetName,
            orderDetails: orderDetails
        })
    }).then(res => {
        document.getElementById('main-content').innerHTML = `
            <h2>Order Submitted!</h2>
            <p>Your order has been sent. Please wait for approval.</p>
            <button onclick="closeApp()">Close</button>
        `;
    });
}


function updateOrder(id, status) {
    fetch(`https://${GetParentResourceName()}/UpdateOrderStatus`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id: id, status: status })
    }).then(res => {
        // alert('Order status updated!');
        showTab('manager');
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
