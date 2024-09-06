document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('user-table-body');
            tableBody.innerHTML = ''; // 테이블 초기화

            data.forEach(user => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td><button onclick="confirmDelete('${user._id}')">Delete</button></td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));
});

// 사용자 삭제 확인 및 삭제 함수
function confirmDelete(userId) {
    const confirmation = confirm('Are you sure you want to delete this user?');
    
    if (confirmation) {
        deleteUser(userId);
    }
}

// 사용자 삭제 함수
function deleteUser(userId) {
    fetch(`/api/users/${userId}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        alert('User deleted successfully');
        location.reload(); // 삭제 후 페이지 새로고침
    })
    .catch(error => console.error('Error:', error));
}
