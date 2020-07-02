package org.algoritmed.amdf005.wcl;

import java.security.Principal;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Mono;

@Controller
public class RestForWClient {
	protected static final Logger logger = LoggerFactory.getLogger(RestForWClient.class);

	String url = "http://jast002.algoritmed.com/";
//	String url = "http://localhost:8022";
	String path = "/r/url_sql_read_db1";
	WebClient client = WebClient.create(url);

	@GetMapping("/r/url_sql_read_remote_db1")
	public @ResponseBody Map<String, Object> url_sql_read_db1(
			@RequestParam(value = "sql", required = true) String sql
		) {
		String path_sql = path+"?sql=" + sql;
		Map map = client.get()
				.uri(path_sql)
				.retrieve().bodyToFlux(Map.class).blockFirst();
		return map;
	}
	
	@PostMapping("/r/url_sql_read_remote_db1")
	public @ResponseBody Map<String, Object> url_sql_read_remote_db1(
			@RequestBody Map<String, Object> data
			,Principal principal
			){
		logger.info("\n--45---Post-- "
				+ "/r/url_sql_read_remote_db1"
				+ " SQL = \n"+data.get("sql")
				+ "\n" + data
				);
		Map data2 = client.post()
				.uri(path)
				.body(Mono.just(data), Map.class)
				.retrieve()
				.bodyToMono(Map.class).block();
		return data2;
	}
	
	@GetMapping("/v/f1")
	public @ResponseBody Map<String, Object> greeting() {
		String string2 = "/r/url_sql_read_db1?sql=SELECT * FROM doc limit 2";
		String string = "/r/url_sql_read_db1?sql=SELECT * FROM doc left join string on string_id=doc_id where parent = 57178";
		Map blockFirst = client.get()
				.uri(string)
				.retrieve().bodyToFlux(Map.class).blockFirst();
		return blockFirst;
	}
}
