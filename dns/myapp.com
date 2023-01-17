;
; BIND data file for local loopback interface
;
$TTL	86400
@	IN	SOA	ns1.myapp.com. hostmaster.myapp.com. (
				123		; Serial
			 604800		; Refresh
			  86400		; Retry
			2419200		; Expire
			 604800 )	; Negative Cache TTL
;
	IN	NS	ns1.myapp.com.
ns1	IN	A	255.0.255.0
www	IN	A	1.2.3.4